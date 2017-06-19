import { UserAuth } from '../../../lib/auth';
import { AuthSession } from '../../../models';

const accountsRouter = require('express').Router();
const sharp = require('sharp');
const async = require('async');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Invite = require('../../../models/Invite');
const User = require('../../../models/User');
const StatusError = require('../../../util/StatusError');
const { Account, Permission } = require('../../../models');
const uuid = require('uuid').v4;
const { sendInvite } = require('../../../lib/inviteMail');
const fileUpload = require('express-fileupload');
const s3 = require('../../../config/s3');

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

/**
 * Upload a accounts's logo
 */
accountsRouter.post('/:accountId/logo', checkPermissions('accounts:update'), fileUpload(), async (req, res, next) => {
  const fileKey = `logos/${req.account.id}/${uuid.v4()}_[size]_${req.files.file.name}`;

  function resizeImage(size, buffer) {
    if (size === 'original') {
      return Promise.resolve(buffer);
    }

    return sharp(buffer)
      .resize(size, size)
      .toBuffer();
  }

  async.eachSeries([
    'original',
    400,
    200,
    100,
  ], async (size, nextImage) => {
    const file = req.files.file.data;
    const resizedImage = await resizeImage(size, file);
    s3.upload({
      Key: fileKey.replace('[size]', size),
      Body: resizedImage,
      ACL: 'public-read',
    }, async (err, response) => {
      console.log(err, response);
      if (err) {
        return next(err);
      }

      nextImage();
    });
  }, async () => {
    try {
      req.account.logo = fileKey;

      const savedAccount = await req.account.save();
      res.send(normalize('account', savedAccount));
    } catch (error) {
      next(error);
    }
  });
});

accountsRouter.delete('/:accountId/logo', checkPermissions('accounts:update'), fileUpload(), async (req, res, next) => {
  try {
    req.account.logo = null;
    const savedAccount = await req.account.save();
    res.send(normalize('account', savedAccount));
  } catch (error) {
    next(error);
  }
});

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
    role: req.body.role,
  }).then((permission) => {
    UserAuth.signup({
      ...req.body,
      username: req.body.email,
      activeAccountId: req.accountId,
      enterpriseId: req.account.enterprise.id,
      permissionId: permission.id,
    }).then(({ model: user }) => {
      delete user.password;
      user.permission = permission;
      res.send(normalize('user', user));
    });
  }).catch(next);
});

accountsRouter.put('/:accountId/permissions/:permissionId', (req, res, next) => {
  const { permission } = req;

  return User.get(req.sessionData.userId)
    .getJoin({permission: true})
    .then((user) => {
      console.log(user.permission.role, req.role)
      if (user.permission.role !== req.role) {
        return next(StatusError(403, 'Access Denied!'));
      }

      if (req.account.id !== req.accountId) {
        return next(StatusError(403, 'req.accountId does not match URL account id'));
      }

      if (req.role !== 'SUPERADMIN' && req.role !== 'OWNER') {
        return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
      }

      return permission.merge(req.body).save()
        .then(p => res.send(normalize('permission', p)))
        .catch(next);

    }).catch(next);
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
        const users = permissions.filter((user) => {
          if (user.permission.role === 'SUPERADMIN') {
            return false;
          }
          return true;
        });
        const obj = normalize('users', users);
        obj.entities.accounts = {
          [req.account.id]: req.account,
        };
        res.send(obj);
      })
      .catch(next);
});

module.exports = accountsRouter;

