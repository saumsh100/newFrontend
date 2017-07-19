
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');
const userRouter = require('express').Router();
const User = require('../../../models/User');
const Permission = require('../../../models/Permission');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const StatusError = require('../../../util/StatusError');
const normalize = require('../normalize');
const { omit } = require('lodash');

userRouter.param('userId', loaders('profile', 'User'));

userRouter.get('/me', ({ userId, accountId, sessionData }, res) =>
  User.get(userId).getJoin({ enterprise: true, permission: true }).then(user => {
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
  })
);

userRouter.get('/:userId', checkPermissions('users:read'), (req, res, next) => {
  return Permission.get(req.profile.permissionId)
  .then((permission) => {
    req.profile.role = permission.role;
    return res.send(normalize('user', req.profile));
  }).catch(next);

});

userRouter.get('/', checkPermissions('users:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;
  return User.filter({ activeAccountId: accountId }).getJoin(joinObject).run()
    .then(users => res.send(normalize('users', users)))
    .catch(next);
});


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
                .then(savedUser => res.send(normalize('user', savedUser)));
            });
        })
        .catch((err) => {
          throw StatusError(401, err.message || 'Invalid current password');
        });
    }))
    .catch(next);
});

module.exports = userRouter;
