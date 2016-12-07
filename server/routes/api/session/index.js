const passport = require('passport')

const sessionRouter = require('express').Router();
// const globals = require('../../../config/globals');



sessionRouter.post('/', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))


sessionRouter.delete('/', (req, res, next) => {
  
});

module.exports = sessionRouter;