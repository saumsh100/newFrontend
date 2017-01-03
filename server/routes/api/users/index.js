const { normalize, Schema, arrayOf } = require('normalizr');
const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../../../models/User');

const userSchema = new Schema('users');


userRouter.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const oldPassword = req.body.oldPassword;
  const password = req.body.password;
  const confirm = req.body.confirm;
  if (password !== confirm) return next({ status: 401 });

  return User.get(id).run().then((user) => {
    return bcrypt.compare(oldPassword, user.password, function (err, match) {
      if (err) return next({ status: 500 });

      if (!match) return next({ status: 401 });

      return bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return next({ status: 500 });

        return User.get(id).update({password: hashedPassword}).run().then((newUser) => {
          return res.end();
        });
      })
    });
  })
  .catch(err => next(err));
});

module.exports = userRouter;
