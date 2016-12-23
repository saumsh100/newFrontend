const sessionRouter = require('express').Router();
const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

sessionRouter.post('/', function(req, res, next) {
  return User.filter({username: req.body.username}).getJoin({activeAccount: true}).run().then(function(users) {
    if (!users.length) {
      return next({status: 401})
    }
    const user = users[0];
    return bcrypt.compare(req.body.password, user.password, function (err, match) {
      if (err) {
        return next({status: 500});
      }
      if (!match) {
        return next({status: 401});
      }
      console.log(user)
      return jwt.sign({
        data: user.toJson,
      }, 'notsosecret', { expiresIn: '1h' }, function(err, token) {
        if (err) {
          return next({status: 500});
        }
        return res.json({token})
      });
    })
  });
});

sessionRouter.delete('/', (req, res, next) => {
  
});

module.exports = sessionRouter;