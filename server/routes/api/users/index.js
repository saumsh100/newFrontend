const { normalize, Schema, arrayOf } = require('normalizr');
const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../../../models/User');

const userSchema = new Schema('users');


userRouter.put('/changePassword', (req, res, next) => {
  const username = req.user.data.username;
  const oldPassword = req.body.oldPassword;
  const password = req.body.password;
  const confirm = req.body.confirm;
  if (password !== confirm) return next({ status: 401 });
  const updatedUser = {};
  updatedUser.username = req.user.data.username;
  User.get(username).run().then((user) => {
    bcrypt.compare(oldPassword, user.password, function (err, match) {
      if (err) {
        return next({ status: 500 });
      }
      if (!match) {
        return next({ status: 401 });
      }
      updatedUser.password = bcrypt.hashSync(password, 10);
      user.merge(updatedUser).save().then((newUser) => {
        console.log(newUser);
        return res.end();
      });
    });
  })
  .catch(err => next(err));
});

module.exports = userRouter;
