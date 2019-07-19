
import zxcvbn from 'zxcvbn';
import { Router } from 'express';
import {
  Account,
  Configuration,
  AccountConfiguration,
  Enterprise,
  Permission,
  User,
} from 'CareCruModels';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import StatusError from '../../../util/StatusError';
import normalize from '../normalize';

const userRouter = Router();

userRouter.param('userId', sequelizeLoader('profile', 'User'));

/**
 * GET /me
 */
userRouter.get('/me', async (req, res, next) => {
  try {
    const { userId, accountId, sessionData } = req;
    const [
      accountData,
      userData,
      adapterTypeConfigData,
    ] = await Promise.all([
      Account.findOne({
        where: { id: accountId },
        attributes: ['timezone'],
      }),

      User.findOne({
        where: { id: userId },
        include: [
          {
            model: Enterprise,
            as: 'enterprise',
          },
          {
            model: Permission,
            as: 'permission',
          },
        ],
      }),

      AccountConfiguration.findOne({
        where: { accountId },
        include: [{
          model: Configuration,
          as: 'configuration',
          where: { name: 'ADAPTER_TYPE' },
          required: true,
        }],
      }),
    ]);

    const account = accountData.get({ plain: true });
    const user = userData.get({ plain: true });
    const adapterTypeConfig = adapterTypeConfigData ?
      adapterTypeConfigData.get({ plain: true }) :
      {};

    const { permissions, ...remainingSessionData } = sessionData;

    return res.json({
      ...remainingSessionData,
      enterprise: user.enterprise,
      role: user.permission.role,
      adapterType: adapterTypeConfig.value,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
      timezone: account.timezone,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:userId
 */
userRouter.get('/:userId', checkPermissions('users:read'), (req, res, next) =>
  Permission.findById(req.profile.permissionId)
    .then((permission) => {
      if (!permission) throw StatusError(500, 'No permission found');
      const user = req.profile.get({ plain: true });
      delete user.password;
      user.role = permission.role;
      return res.send(normalize('user', user));
    })
    .catch(next));

/**
 * GET /
 */
userRouter.get('/', checkPermissions('users:read'), (req, res, next) => {
  const { accountId, includeArray } = req;

  const queryData = {
    raw: true,
    where: { activeAccountId: accountId },

    include: includeArray,
  };

  return User.findAll(queryData)
    .then(users => res.send(normalize('users', users)))
    .catch(next);
});


userRouter.put('/:userId/preferences', checkPermissions('users:update'), (req, res, next) => req.profile
  .update(req.body)
  .then(user => res.send(normalize('user', user.get({ plain: true }))))
  .catch(next));

/**
 * PUT /:userId
 */
userRouter.put('/:userId', (req, res, next) => {
  Promise.resolve(req.profile)
    .then((user) => {
      // TODO: allow users to change more than just password here...
      // TODO: ensure all the attributes are here before performing this logic
      const { oldPassword, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return next(StatusError(401, 'Passwords do not match'));
      }

      // Check if the password is valid,
      // if so, we must set the new password, other attrs and then save
      // if all is well, we respond with the updated user
      return user
        .isValidPasswordAsync(oldPassword)
        .then(() => {
          const { score, feedback: { warning } } = zxcvbn(password);
          if (score < 2) {
            return next(StatusError(401, {
              body: warning || 'New password not strong enough',
              field: 'password',
            }));
          }

          return user.setPasswordAsync(password)
            .then(updatedUser => updatedUser.save()
              .then(savedUser => res.send(normalize('user', savedUser.dataValues))));
        })
        .catch((err) => {
          throw StatusError(401, { body: err.message.body || 'Invalid current password' });
        });
    })
    .catch(next);
});

/**
 * DELETE /:userId
 */
userRouter.delete('/:userId', (req, res, next) => {
  if (req.role !== 'SUPERADMIN' && req.role !== 'OWNER') {
    return res.sendStatus(401);
  }
  return req.profile
    .destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = userRouter;
