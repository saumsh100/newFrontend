import { UserAuth } from '../../../lib/auth';
import { AuthSession } from '../../../models';

const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Invite = require('../../../models/Invite');
const User = require('../../../models/User');
const StatusError = require('../../../util/StatusError');
const { Account, Permission } = require('../../../models');
const uuid = require('uuid').v4;
const { sendInvite } = require('../../../lib/inviteMail');

accountsRouter.param('accountId', loaders('account', 'Account', { enterprise: true }));
accountsRouter.param('inviteId', loaders('invite', 'Invite'));
accountsRouter.param('permissionId', loaders('permission', 'Permission'));

// List of all available accounts to switch
accountsRouter.get('/', checkPermissions('accounts:read'), ({ accountId, role, enterpriseRole, enterpriseId, sessionData }, res, next) =>
  (((role === 'SUPERADMIN') || (enterpriseRole === 'OWNER')) ?
    Account.filter({ enterpriseId }).run() :
    Account.filter({ id: accountId }).run())

    .then(accounts => res.send(normalize('accounts', accounts)))
    .catch(next)
);

accountsRouter.post('/:accountId/switch', (req, res, next) => {
  const { account, role, sessionId, userId, sessionData } = req;
  if (role !== 'SUPERADMIN') {
    return next(StatusError(403, 'Operation not permitted.'));
  }

  const accountId = account.id;
  const modelId = userId;

  // User.hasOne(permission)
  return Permission.filter({ userId }).run()
    .then(([permission]) => (permission || (role === 'SUPERADMIN')) || Promise.reject(StatusError(403, 'User don\'t have permissions for this account.')))
    .then(() => UserAuth.updateSession(sessionId, sessionData, { accountId }))
    .then(newSession => UserAuth.signToken({
      userId: modelId,
      activeAccountId: accountId,
      sessionId: newSession.id,
    }))
    .then(signedToken => res.json({ token: signedToken }))
    .catch(next);
});

accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    joinObject,
  } = req;

  /*// Some default code to ensure we don't pull the entire conversation for each chat
  if (joinObject.weeklySchedule) {
    joinObject.weeklySchedule = {
      _apply: (sequence) => {
        return sequence
          .getJoin({
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          });
      },
    };
  }*/

  return Account.get(req.account.id).getJoin(joinObject)
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

accountsRouter.post('/:accountId/newUser/', (req, res, next) => {

  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  if (req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
  }

  return Permission.save({
    role: 'MANAGER',
  }).then((permission) => {
    UserAuth.signup({
      ...req.body,
      username: req.body.email,
      activeAccountId: req.accountId,
      enterpriseId: req.account.enterprise.id,
      permissionId: permission.id,
    }).then(({ savedModel: user }) => {
      delete user.password;
      user.permission = permission;
      res.send(normalize('user', user));
    });
  }).catch(next);
});

accountsRouter.put('/:accountId/permissions/:permissionId', (req, res, next) => {
  const { permission } = req;

  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  if (req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
  }

  permission.merge(req.body).save()
    .then(p => res.send(normalize('permission', p)))
    .catch(next);
});


accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then(account => {res.send(normalize('account', account))})
    .catch(next);
});

accountsRouter.get('/:accountId/invites', (req, res, next) => {
  console.log(req.account.id);

  return Invite.filter({ accountId: req.account.id }).getJoin({}).run()
    .then((invites) => {
      res.send(normalize('invites', invites));
    })
    .catch(next);
});

accountsRouter.post('/:accountId/invites', (req, res, next) => {
  // Override accountId, and add token
  const newInvite = req.body;
  newInvite.accountId = req.accountId;
  newInvite.token = uuid();
  newInvite.enterpriseId = req.account.enterprise.id;

  return Invite.save(newInvite)
    .then((invite) => {
      const fullUrl = `${req.protocol}://${req.get('host')}/signupinvite/${invite.token}`;
      User.filter({ id: invite.sendingUserId }).run()
        .then((user) => {
          const mergeVars = [
            {
              name: 'URL',
              content: fullUrl,
            },
            {
              name: 'NAME',
              content: `${user[0].firstName} ${user[0].lastName}`,

            },
          ];
          sendInvite({
            subject: 'Test',
            toEmail: invite.email,
            mergeVars,
          });
          res.send(normalize('invite', invite));
        });
    })
    .catch(next);

});


accountsRouter.delete('/:accountId/invites/:inviteId', (req, res, next) => {
  // make sure requesting user is trying to delete invites for his account
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  // Make sure the invite is owned by the account
  if (req.invite.accountId !== req.account.id) {
    return next(StatusError(403, `Cannot delete invites that are not owned by the acccount with id: ${req.account.id}`));
  }

  return req.invite.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});


accountsRouter.get('/:accountId/users', (req, res, next) => {
  return User.filter({ enterpriseId: req.account.enterprise.id })
      .filter({ activeAccountId: req.account.id }).getJoin({ permission: true }).run()
      .then((permissions) => {
        const obj = normalize('users', permissions);
        obj.entities.accounts = {
          [req.account.id]: req.account,
        };
        res.send(obj);
      })
      .catch(next);
});

module.exports = accountsRouter;

