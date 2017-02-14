
const rootRouter = require('express').Router();
const authRouter = require('./auth');
const apiRouter = require('./api');
const twilioRouter = require('./twilio');

const Token = require('../models/Token');
const Appointment = require('../models/Appointment');


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

// All other traffic, just render app
// TODO: Need to update client-side router to handle this
rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: Check if authenticated...
  return res.render('app');
});

module.exports = rootRouter;
