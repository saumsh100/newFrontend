
const apiRouter = require('./api');
const rootRouter = require('express').Router();


// Bind REST API
rootRouter.use('/api', apiRouter);

// Booking Widget IFRAME Embed
rootRouter.get('/embed', (req, res, next) => {
  return res.render('embed');
});

rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: Check if authenticated...
  return res.render('app');
});

module.exports = rootRouter;
