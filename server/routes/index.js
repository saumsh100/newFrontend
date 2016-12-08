
const apiRouter = require('./api');
const rootRouter = require('express').Router();
const authenticationMiddleware = require('../config/passport').authenticationMiddleware
const sessionRouter = require('./api/session')


// Bind REST API
rootRouter.use('/api/session', sessionRouter);
rootRouter.use('/api', authenticationMiddleware(), apiRouter);

// Booking Widget IFRAME Embed
rootRouter.get('/embed', (req, res, next) => {
  return res.render('embed');
});

rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: Check if authenticated...
  return res.render('app');
});

module.exports = rootRouter;
