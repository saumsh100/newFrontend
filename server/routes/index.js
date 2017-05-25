import apiRouter from './api';
const rootRouter = require('express').Router();
const subdomain = require('express-subdomain');
const authRouter = require('./auth');
const myRouter = require('./my');
const twilioRouter = require('./twilio');
const signupRouter = require('./signup');
const Token = require('../models/Token');
const Invite = require('../models/Invite');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Bind subdomain capturing
// Will be removed once microservices are in full effect
rootRouter.use(subdomain('my', myRouter));

// Bind auth route to generate tokens
rootRouter.use('/auth', authRouter);

rootRouter.use('/signup', signupRouter);

rootRouter.get('/atoms', (req, res, next) => {
  res.send('ATOMS');
});

// Bind REST API
rootRouter.use('/api', apiRouter);

// Twilio REST handlers to receive incoming comms
rootRouter.use('/twilio', twilioRouter);

// Booking Widget IFRAME Embed
rootRouter.get('/embed', (req, res, next) => {
  return res.render('embed');
});

rootRouter.get('/signupinvite/:tokenId', (req, res, next) => {
  Invite.filter({ token: req.params.tokenId }).run()
    .then((invite) => {
      if (invite.length === 0) {
        res.send(404);
      }
      else {
        res.redirect(`/signup/${req.params.tokenId}/`);
      }
    })
    .catch(next);
});

rootRouter.post('/userCheck', (req, res, next) => {
  const username = req.body.email.toLowerCase();
  User.filter({ username }).run()
    .then((user) => {
      console.log(user)
      if (user[0]) {
        res.send({exists: true});
      } else {
        res.send({exists: false});
      }
    })
    .catch(next);
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
