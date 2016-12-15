const sessionRouter = require('express').Router();
const User = require('../../../models/User');
const bcrypt = require('bcrypt');

sessionRouter.post('/', function(req, res, next) {
  User.filter({username: req.body.username}).run().then(function(users) {
    if (!users.length) {
      return next({status: 401})
    }
    const user = users[0];
    bcrypt.compare(req.body.password, user.password, function (err, match) {
      if (err) {
        return next({status: 500});
      }
      if (!match) {
        return next({status: 401});
      }

      return res.end()
    })
  });

});

sessionRouter.delete('/', (req, res, next) => {
  
});

module.exports = sessionRouter;