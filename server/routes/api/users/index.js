
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn');
const userRouter = require('express').Router();
const User = require('../../../models/User');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const StatusError = require('../../../util/StatusError');
const normalize = require('../normalize');

userRouter.param('userId', loaders('profile', 'User'));


userRouter.get('/',checkPermissions('users:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  console.log(accountId);
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
