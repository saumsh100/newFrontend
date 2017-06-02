import { UserAuth } from '../../../lib/auth';
import { AuthToken } from '../../../models';

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

accountsRouter.param('accountId', loaders('account', 'Account'));
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

// TODO: add proper permissions check
accountsRouter.post('/:accountId/switch', ({ account, role, tokenId, userId, sessionData }, res, next) => {

  // TODO: or enterprise OWNER
  if (role !== 'SUPERADMIN') {
    return next(StatusError(403, 'Operation not permitted.'));
  }

  const accountId = account.id;
  const modelId = userId;

  // TODO: check is account related to current enterprise

  return Permission.filter({ accountId, userId }).run()
    .then(([permission]) => permission || Promise.reject(StatusError(403, 'User don\'t have permissions for this account.')))
    .then(() => UserAuth.updateToken(tokenId, sessionData, { accountId }))
    .then(newToken => UserAuth.signToken({
      userId: modelId,
      activeAccountId: accountId,
      tokenId: newToken.id,
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

accountsRouter.put('/:accountId/permissions/:permissionId', (req, res, next) => {
  const { permission } = req;

  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  if (req.role !== 'OWNER') {
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
  return Permission.filter({ accountId: req.account.id }).getJoin({ users: true }).run()
    .then((permissions) => {
      const noPassword = permissions.map((permission) => {
        delete permission.users[0].password;
        return permission;
      });

      const obj = normalize('permissions', noPassword);
      obj.entities.accounts = {
        [req.account.id]: req.account,
      };

      res.send(obj);
    })
    .catch(next);
});

module.exports = accountsRouter;

