
import { Router } from 'express';
import subdomain from 'express-subdomain';
import apiRouter from './api';
import sequelizeApiRouter from './_api';
import authRouter from './auth';
import myRouter from './my';
import callrailRouter from './callrail';
import twilioRouter from './twilio';
import signupRouter from './signup';
import {
  Appointment,
  Invite,
  Token,
  User,
} from '../models';
import loaders from './util/loaders';

const rootRouter = Router();

rootRouter.param('sentReminderId', loaders('sentReminder', 'SentReminder', { appointment: true }));

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

// New REST API with sequelize
rootRouter.use('/_api', sequelizeApiRouter);

// Webhooks!
rootRouter.use('/twilio', twilioRouter);
rootRouter.use('/callrail', callrailRouter);

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
      res.send({ exists: !!user[0] });
    })
    .catch(next);
});

rootRouter.get('/sentReminders/:sentReminderId/confirm', async (req, res, next) => {
  try {
    const sentReminder = req.sentReminder;
    await sentReminder.merge({ isConfirmed: true }).save();

    // For any confirmed reminder we confirm appointment
    const { appointment } = sentReminder;
    if (appointment) {
      await appointment.merge({ isConfirmed: true }).save();
    }

    res.render('confirmation-success');
  } catch (err) {
    next(err);
  }
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
