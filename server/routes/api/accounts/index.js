
import { UserAuth } from '../../../lib/auth';

const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const StatusError = require('../../../util/StatusError');
const {
  Account,
  Invite,
  User,
  Permission,
} = require('../../../models');
const uuid = require('uuid').v4;
const upload = require('../../../lib/upload');

accountsRouter.param('accountId', loaders('account', 'Account', { enterprise: true }));
accountsRouter.param('inviteId', loaders('invite', 'Invite'));
accountsRouter.param('permissionId', loaders('permission', 'Permission'));

/**
 * GET /
 *
 * - list of accounts in an enterprise
 * - must be a SUPERADMIN or OWNER to list all
 * - if not, it just lists the one
 */
accountsRouter.get('/', checkPermissions('accounts:read'), (req, res, next) => {
  const { accountId, role, enterpriseRole, enterpriseId, sessionData } = req;
  return (((role === 'SUPERADMIN') || (enterpriseRole === 'OWNER')) ?
    Account.filter({ enterpriseId }).run() :
    Account.filter({ id: accountId }).run())
      .then(accounts => res.send(normalize('accounts', accounts)))
      .catch(next)
});

/**
 * GET /:accountId/logo
 *
 * - Upload a accounts's logo
 */
accountsRouter.post('/:accountId/logo', checkPermissions('accounts:update'), async (req, res, next) => {
  // TODO: there are no tests for this, easy route to change
  const fileKey = `logos/${req.account.id}/${uuid.v4()}_[size]_${req.files.file.name}`;
  try {
    await upload(fileKey, req.files.file.data);

    req.account.logo = fileKey;
    const savedAccount = await req.account.save();

    return res.send(normalize('account', savedAccount));
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /:accountId/logo
 *
 * - remove the account logo
 */
accountsRouter.delete('/:accountId/logo', checkPermissions('accounts:update'), async (req, res, next) => {
  try {
    req.account.logo = null;
    const savedAccount = await req.account.save();
    res.send(normalize('account', savedAccount));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /:accountId/switch
 *
 * - only superadmins are allowed to switch into accounts right now...
 *
 */
accountsRouter.post('/:accountId/switch', (req, res, next) => {
  const { account, role, sessionId, userId, sessionData } = req;
  if (role !== 'SUPERADMIN') {
    return next(StatusError(403, 'Operation not permitted'));
  }

  const accountId = account.id;
  const modelId = userId;

  // User.hasOne(permission)
  return Permission.filter({ userId }).run()
    .then(([permission]) => (permission || (role === 'SUPERADMIN')) || Promise.reject(StatusError(403, 'User don\'t have permissions for this account.')))
    .then(() => UserAuth.updateSession(sessionId, sessionData, { accountId }))
    // TODO: do we need to do a newSession.id?
    .then(newSession => UserAuth.signToken({
      userId: modelId,
      activeAccountId: accountId,
      sessionId: newSession.id,
    }))
    .then(signedToken => res.json({ token: signedToken }))
    .catch(next);
});

/**
 * GET /:accountId
 *
 * - get basic account data
 *
 */
accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    joinObject,
  } = req;

  /* // Some default code to ensure we don't pull the entire conversation for each chat
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

/**
 * POST /:accountId/newUser
 *
 * - add user to account
 *
 */
accountsRouter.post('/:accountId/newUser/', (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  if (req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
  }

  return Permission.save({ role: req.body.role })
    .then((permission) => {
      return UserAuth.signup({
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
    })
    .catch(next);
});

/**
 * PUT /:accountId
 *
 * - update clinic account data
 */
accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then((account) => { res.send(normalize('account', account)); })
    .catch(next)
});

/**
 * GET /:accountId/users
 *
 * - get all of the user's in the clinic
 */
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
    .catch(next)
});

module.exports = accountsRouter;

