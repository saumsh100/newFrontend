const passport = require('passport')

const sessionRouter = require('express').Router();
// const globals = require('../../../config/globals');


sessionRouter.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return next({info, status: 403}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
    });
  })(req, res, next);
});

sessionRouter.delete('/', (req, res, next) => {
  
});

module.exports = sessionRouter;