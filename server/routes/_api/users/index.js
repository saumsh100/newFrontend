
import bcrypt from 'bcrypt';
import zxcvbn from 'zxcvbn';
import { Router } from 'express';
import omit from  'lodash/omit';
import {
  Enterprise,
  Permission,
  User,
} from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import StatusError from '../../../util/StatusError';
import normalize from '../normalize';

const userRouter = Router();

userRouter.param('userId', sequelizeLoader('profile', 'User'));

/**
 * GET /me
 */
userRouter.get('/me', (req, res, next) => {
  const { userId, accountId, sessionData } = req;
  return User.findOne({
    where: {
      id: userId,
    },

    include: [
      { model: Enterprise, as: 'enterprise' },
      { model: Permission, as: 'permission' },
    ],
  }).then(user => {
    user = user.get({ plain: true });
    const role = user.permission.role;
    return res.json({
      ...(omit(sessionData, ['permissions'])),
      enterprise: user.enterprise,
      role,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  }).catch(next);
});

/**
 * GET /:userId
 */
userRouter.get('/:userId', checkPermissions('users:read'), (req, res, next) => {
  return Permission.findById(req.profile.permissionId)
  .then((permission) => {
    if (!permission) throw StatusError(500, 'No permission found');
    const user = req.profile.get({ plain: true });
    delete user.password;
    user.role = permission.role;
    return res.send(normalize('user', user));
  }).catch(next);

});

/**
 * GET /
 */
userRouter.get('/', checkPermissions('users:read'), (req, res, next) => {
  const {
    accountId,
    includeArray,
  } = req;

  const queryData = {
    raw: true,
    where: {
      activeAccountId: accountId,
    },

    include: includeArray,
  };

  return User.findAll(queryData)
    .then(users => res.send(normalize('users', users)))
    .catch(next);
});


/**
 * PUT /:userId
 */
userRouter.put('/:userId', (req, res, next) => {
  Promise.resolve(req.profile)
    .then(((user) => {
      // TODO: allow users to change more than just password here...
      // TODO: ensure all the attributes are here before performing this logic
      const { oldPassword, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return next(StatusError(401, 'Passwords do not match'));
      }

      // Check if the password is valid,
      // if so, we must set the new password, other attrs and then save
      // if all is well, we respond with the updated user
      return user.isValidPasswordAsync(oldPassword)
        .then(() => {
          // TODO: this code is duplicated on frontend, refactor for isomoprohic functions
          const result = zxcvbn(password);
          const { score, feedback: { warning } } = result;
          if (score < 2) {
            throw StatusError(401, warning || 'New password not strong enough');
          }

          return user.setPasswordAsync(password)
            .then((updatedUser) => {
              // Now save and respond finally!
              return updatedUser.save()
                .then(savedUser => res.send(normalize('user', savedUser.dataValues)));
            });
        })
        .catch((err) => {
          throw StatusError(401, err.message || 'Invalid current password');
        });
    }))
    .catch(next);
});

module.exports = userRouter;
