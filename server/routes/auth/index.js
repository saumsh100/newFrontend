const authRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const globals = require('../../config/globals');
const User = require('../../models/User');
const Invite = require('../../models/Invite');
const Permission = require('../../models/Permission');
const StatusError = require('../../util/StatusError');
const saltRounds = 10;


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


authRouter.post('/signupinvite/:token', (req, res, next) => {
  // Get user by the unique username
  const newUser = req.body;

  if (newUser.passwordConfirmation === newUser.password) {
    return next(StatusError(400, 'Passwords Do Not Match!'));
  }

  if (!newUser.username || !newUser.password || !newUser.lastName || !newUser.firstName ) {
    return next(StatusError(400, 'Please  Fill in all Values'));
  }

  newUser.password = bcrypt.hashSync(newUser.password, saltRounds);

  User.filter({username: newUser.username}).run()
    .then(checkEmail => {
      if (checkEmail[0]) {
        console.log(checkEmail)
        return next(StatusError(400, 'Email Already in Use'));
      }
      Invite.filter({token: req.params.token}).run()
        .then((invite) => {
          console.log(invite, 'asdasdsa');
          if (!invite[0]) {
            return next(StatusError(401, 'Bad invite'));
          } else {
            newUser.activeAccountId = invite[0].accountId;
            User.save(newUser)
              .then((user) => {
                const newPermission = {
                  userId: user.id,
                  accountId: user.activeAccountId,
                  role: 'OWNER',
                  permissions: {},
                }
                Permission.save(newPermission)
                  .then((permission) => {
                    Invite.get(invite[0].id).then((inviteDelete) => {
                      inviteDelete.delete();
                      const {role, permissions = {}} = permission;
                      const tokenData = {role, permissions, userId: user.id, activeAccountId: user.activeAccountId};

                      console.log('signing token', tokenData);

                      return jwt.sign(tokenData, globals.tokenSecret, {expiresIn: globals.tokenExpiry}, (error, token) => {
                        if (error) {
                          return next(StatusError(500, 'Error signing the token'));
                        }

                        return res.json({token});
                      });
                    });
                  });
              });
          }
        })
    })
    .catch(next);

});

module.exports = authRouter;
