
const rootRouter = require('express').Router();
const subdomain = require('express-subdomain');
const apiRouter = require('./api');
const authRouter = require('./auth');
const myRouter = require('./my');
const twilioRouter = require('./twilio');

const Token = require('../models/Token');
const Appointment = require('../models/Appointment');

// Bind subdomain capturing
// Will be removed once microservices are in full effect
rootRouter.use(subdomain('my', myRouter));

// Bind auth route to generate tokens
rootRouter.use('/auth', authRouter);

// Bind REST API
rootRouter.use('/api', apiRouter);

// Twilio REST handlers to receive incoming comms
rootRouter.use('/twilio', twilioRouter);

// Booking Widget IFRAME Embed
rootRouter.get('/embed', (req, res, next) => {
  return res.render('embed');
});

rootRouter.get('/confirmation/:tokenId', (req, res, next) => {
  Token.filter({ id: req.params.tokenId }).run().then((token) => {
    Appointment.get(token[0].appointmentId).run().then((a) => {
      a.merge({ confirmed: true }).save().then(() => {
        res.render('confirmation-success');
        token[0].delete().then((t) => {
          console.log(`Token ${t} was deleted`);
        }).catch(next);
      }).catch(next);
    }).catch(next);
  }).catch(next);
});

rootRouter.get('/patients', (req, res, next) => {
  return res.render('patient');
});

// All other traffic, just render app
// TODO: Need to update client-side router to handle this
rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: Check if authenticated...
  return res.render('app');
});

module.exports = rootRouter;
