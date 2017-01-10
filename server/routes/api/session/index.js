
const sessionRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../models/User');
const Permission = require('../../../models/Permission');
const StatusError = require('../../../util/StatusError');

sessionRouter.post('/', (req, res, next) => {
  console.log(req.body.username, req.body.password);
  
  return User
    .filter({ username: req.body.username })
    .run()
    .then((users) => {
      if (!users.length) {
        return next(StatusError(500, 'No user found'));
      }
      
      const user = users[0];
      return bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (err) {
          return next(StatusError(500, 'Error comparing passwords'));
        }
        
        if (!match) {
          return next(StatusError(401, 'Invalid credentials'));
        }
        
        return Permission
          .filter({ userId: user.id })
          .run()
          .then((permission) => {
            if (!permission || !permission[0]) {
              return next(StatusError(500, 'User has no account permissions'));
            }
            
            permission = permission[0];
            const data = {
              user: user.toJson,
              role: permission.role,
              permissions: permission.permissions || {},
            };
            
            return jwt.sign(data, 'notsosecret', { expiresIn: '1d' }, (err, token) => {
              if (err) {
                return next(StatusError(500, 'Error signing the token'));
              }
              
              return res.json({ token });
            });
          });
      });
    });
});

module.exports = sessionRouter;
