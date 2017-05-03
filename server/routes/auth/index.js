const authRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const globals = require('../../config/globals');
const User = require('../../models/User');
const Permission = require('../../models/Permission');
const StatusError = require('../../util/StatusError');

// TODO: find a better way to do Model.findOne

authRouter.post('/', (req, res, next) => {
  // Get user by the unique username
  return User
    .filter({ username: req.body.username })
    .run()
    .then((users) => {
      if (!users.length) {
        return next(StatusError(500, 'No user found'));
      }

      // Make sure the password is a match
      const { id, activeAccountId, password } = users[0];
      return bcrypt.compare(req.body.password, password, (err, match) => {
        if (err) {
          return next(StatusError(500, 'Error comparing passwords'));
        }

        if (!match) {
          return next(StatusError(401, 'Invalid credentials'));
        }

        // Pull the permission to add role and extra permissions to token
        return Permission
          .filter({ userId: id })
          .run()
          .then((permission) => {
            if (!permission || !permission[0]) {
              return next(StatusError(500, 'User has no account permissions'));
            }

            const { role, permissions = {} } = permission[0];
            const tokenData = { role, permissions, userId: id, activeAccountId };

            console.log('signing token', tokenData);

            return jwt.sign(tokenData, globals.tokenSecret, { expiresIn: globals.tokenExpiry }, (error, token) => {
              if (error) {
                return next(StatusError(500, 'Error signing the token'));
              }

              return res.json({ token });
            });
          });
      });
    })
    .catch(err => next(err));
});

module.exports = authRouter;
