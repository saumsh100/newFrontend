
const rootRouter = require('express').Router();
const apiRouter = require('./api');
const twilioRouter = require('./twilio');

// Bind REST API
rootRouter.use('/api', apiRouter);

// Twilio REST handlers to receive incoming comms
rootRouter.use('/twilio', twilioRouter);

// Booking Widget IFRAME Embed
rootRouter.get('/embed', (req, res, next) => {
  return res.render('embed');
});

// All other traffic, just render app
// TODO: Need to update client-side router to handle this
rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: Check if authenticated...
  return res.render('app');
});

module.exports = rootRouter;
