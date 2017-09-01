
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { UserAuth } from '../../../lib/_auth';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import StatusError from'../../../util/StatusError';
import {
  Account,
  Enterprise,
  Invite,
  Permission,
  User,
} from '../../../_models';
import upload from '../../../lib/upload';
import { sequelizeLoader } from '../../util/loaders';

const accountsRouter = Router();

accountsRouter.param('accountId', sequelizeLoader('account', 'Account'));
accountsRouter.param('joinAccountId', sequelizeLoader('account', 'Account', [{ model: Enterprise, as: 'enterprise' }]));
accountsRouter.param('inviteId', sequelizeLoader('invite', 'Invite'));
accountsRouter.param('permissionId', sequelizeLoader('permission', 'Permission'));

/**
 * GET /
 *
 * - list of accounts in an enterprise
 * - must be a SUPERADMIN or OWNER to list all
 * - if not, it just lists the one
 */
accountsRouter.get('/', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const { accountId, role, enterpriseRole, enterpriseId, sessionData } = req;

    // Fetch all if correct role, just fetch current account if not
    let accounts;
    if (role === 'SUPERADMIN' || enterpriseRole === 'OWNER') {
      accounts = await Account.findAll({
        raw: true,
        where: { enterpriseId },
      });
    } else {
      accounts = [await Account.findOne({
        raw: true,
        where: { id: accountId },
      })];
    }

    res.send(normalize('accounts', accounts));
  } catch (err) {
    next(err);
  }
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
    const savedAccount = await req.account.update({ logo: fileKey });

    return res.send(normalize('account', savedAccount.get({ plain: true })));
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
    res.send(normalize('account', savedAccount.get({ plain: true })));
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
  const { account, role, sessionId, permissionId, userId, sessionData } = req;
  if (role !== 'SUPERADMIN' && role !== 'OWNER' && role !== 'ADMIN') {
    return next(StatusError(403, 'Operation not permitted'));
  }

  const accountId = account.id;
  const modelId = userId;

  // User.hasOne(permission)
  return Permission.findOne({ where: { id: permissionId } })
    .then(permission => (permission || (role === 'SUPERADMIN')) || Promise.reject(StatusError(403, 'User don\'t have permissions for this account.')))
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
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    includeArray,
  } = req;

  // TODO: need to add joinObject mapping to include...

  // Loader will handle 404
  return Account.findOne({ where: { id: req.account.id }, include: includeArray })
    .then(account => res.send(normalize('account', account.get({ plain: true }))))
    .catch(next);
});

/**
 * POST /:accountId/newUser
 *
 * - add user to account
 *
 */
accountsRouter.post('/:joinAccountId/newUser', (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  if (req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
  }

  return Permission.create({ role: req.body.role })
    .then((permission) => {
      return UserAuth.signup({
        ...req.body,
        username: req.body.email,
        activeAccountId: req.accountId,
        enterpriseId: req.account.enterprise.id,
        permissionId: permission.id,
      }).then(({ model: user }) => {
        return User.findOne({
          where: { id: user.dataValues.id },
          include: [
            {
              model: Permission,
              as: 'permission',
            },
          ],
          raw: true,
          nest: true,
        }).then((userSend) => {
          delete userSend.password;
          return res.status(201).send(normalize('user', userSend));
        });
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
  return req.account.update(req.body)
    .then(account => res.send(normalize('account', account.dataValues)))
    .catch(next);
});

/**
 * GET /:accountId/users
 *
 * - get all of the user's in the clinic
 */
accountsRouter.get('/:joinAccountId/users', (req, res, next) => {
  return User.findAll({
      //raw: true,
      include: [{ model: Permission, as: 'permission' }],
      where: {
        enterpriseId: req.account.enterprise.id,
        // TODO: i don't think this should be there...
        activeAccountId: req.account.id,
      },
    })
    .then((users) => {
      users = users.filter(user => user.permission.role !== 'SUPERADMIN');
      users = users.map(u => u.get({ plain: true }));
      const obj = normalize('users', users);

      const account = req.account.dataValues;
      delete account.enterprise;
      obj.entities.accounts = {
        [account.id]: account,
      };

      res.send(obj);
    })
    .catch(next);
});

module.exports = accountsRouter;

