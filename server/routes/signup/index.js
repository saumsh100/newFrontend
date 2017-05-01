const signupRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const globals = require('../../config/globals');
const User = require('../../models/User');
const Invite = require('../../models/Invite');
const Permission = require('../../models/Permission');
const StatusError = require('../../util/StatusError');
const saltRounds = 10;

signupRouter.post('/:token', (req, res, next) => {
  // Get user by the unique username
  const newUser = req.body;

  if (newUser.confirmPassword !== newUser.password) {
    return next(StatusError(400, 'Passwords Do Not Match!'));
  }

  if (!newUser.username || !newUser.password || !newUser.lastName || !newUser.firstName) {
    return next(StatusError(400, 'Please  Fill in all Values'));
  }
  newUser.username=newUser.username.toLowerCase();
  newUser.password = bcrypt.hashSync(newUser.password, saltRounds);

  User.filter({ username: newUser.username }).run()
    .then((checkEmail) => {
      if (checkEmail[0]) {
        return next(StatusError(400, 'Email Already in Use'));
      }

      Invite.filter({token: req.params.token}).run()
        .then((invite) => {
          if (!invite[0]) {
            return next(StatusError(401, 'Bad invite'));
          } else {
            newUser.activeAccountId = invite[0].accountId;
            User.save(newUser)
              .then((user) => {
                const newPermission = {
                  userId: user.id,
                  accountId: user.activeAccountId,
                  role: 'VIEWER',
                  permissions: {},
                }

                Permission.save(newPermission)
                  .then((permission) => {
                    Invite.get(invite[0].id).then((inviteDelete) => {
                      inviteDelete.delete();
                      res.send(200);
                    });
                  });

              });
          }
        })
    })
    .catch(next);

});

module.exports = signupRouter;
