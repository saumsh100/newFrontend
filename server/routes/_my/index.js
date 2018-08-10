
/* eslint-disable consistent-return */
import { Router } from 'express';
import fs from 'fs';
import url from 'url';
import pick from 'lodash/pick';
import StatusError from '../../util/StatusError';
import { lookupsClient } from '../../config/twilio';
import newAvailabilitiesRouter from './newAvailabilitiesRouter';
import requestRouter from '../_api/request';
import waitSpotsRouter from '../_api/waitSpots';
import authRouter from './auth';
import reviewsRouter from './reviews';
import familiesRouter from './families';
import sentReviewsRouter from './sentReviews';
import widgetsRouter from './widgets';
import unsubRouter from './unsubscribe';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import {
  Account,
  Appointment,
  Patient,
  PatientUser,
  Practitioner,
  PatientUserReset,
  Reminder,
} from '../../_models';
import { validatePhoneNumber } from '../../util/validators';
import { sequelizeLoader } from '../util/loaders';
import { generateAccountParams, encodeParams } from './util/params';
import normalize from '../_api/normalize';

const myRouter = Router();

myRouter.use('/', newAvailabilitiesRouter);
myRouter.use('/', unsubRouter);
myRouter.use('/requests', sequelizeAuthMiddleware, requestRouter);
myRouter.use('/waitSpots', sequelizeAuthMiddleware, waitSpotsRouter);
myRouter.use('/families', sequelizeAuthMiddleware, familiesRouter);
myRouter.use('/auth', authRouter);

myRouter.param('sentReminderId', sequelizeLoader('sentReminder', 'SentReminder', [
  { model: Appointment, as: 'appointment' },
  { model: Patient, as: 'patient' },
  { model: Reminder, as: 'reminder' },
]));

myRouter.param('accountId', sequelizeLoader('account', 'Account'));
myRouter.param('patientId', sequelizeLoader('patient', 'Patient'));
myRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
myRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

myRouter.use('/reviews', reviewsRouter);
myRouter.use('/sentReviews', sentReviewsRouter);
myRouter.use('/widgets', widgetsRouter);

// Used on patient signup form to determine if a patientUser's email is taken
myRouter.post('/patientUsers/email', async (req, res, next) => {
  let {
    email,
  } = req.body;

  email = email && email.toLowerCase();

  try {
    const patientUsers = await PatientUser.findAll({ where: { email } });
    return res.send({ exists: !!patientUsers[0] });
  } catch (error) {
    next(error);
  }
});

// Used on patient signup form to determine if a patientUser's phoneNumber is taken
myRouter.post('/patientUsers/phoneNumber', async (req, res, next) => {
  let {
    phoneNumber,
  } = req.body;

  phoneNumber = validatePhoneNumber(phoneNumber);
  try {
    const patientUsers = await PatientUser.findAll({ where: { phoneNumber } });
    const alreadyExists = !!patientUsers[0];
    if (alreadyExists) {
      return res.send({ error: 'There is already a user with that mobile number.' });
    }

    lookupsClient.phoneNumbers(phoneNumber).get({
      type: 'carrier',
    }, function(error, number) {
      if (error) {
        return res.sendStatus(200);
      }

      const isLandline = number && number.carrier && number.carrier.type === 'landline';
      if (isLandline) {
        res.send({ error: 'You cannot use a landline number. Please enter a mobile number.' });
      } else {
        res.sendStatus(200);
      }
    });
  } catch (error) {
    next(error);
  }
});

myRouter.get('/patientUsers/:patientUserId', (req, res, next) => {
  try {
    const patientUser = req.patientUser.get({ plain: true });
    delete patientUser.password;
    res.json(patientUser);
  } catch (err) {
    next(err);
  }
});

myRouter.post('/patientUsers/:patientUserId/patientUsers', async (req, res, next) => {
  try {
    const patientUser = await PatientUser.create(req.body);

  } catch (err) {
    next(err);
  }
});

myRouter.get('/reset/:tokenId', (req, res, next) => {
  const tokenId = req.params.tokenId;
  return PatientUserReset.findOne({ where: { token: tokenId } })
    .then((reset) => {
      if (!reset) {
        // TODO: replace with StatusError and pass to next...
        res.status(404).send();
      } else {
        // TODO: add encoded params
        const { accountId } = reset;
        return Account.findOne({ where: { id: accountId } })
          .then((account) => {
            const params = {
              account: generateAccountParams(account),
            };

            res.redirect(url.format({
              pathname: `/reset-password/${tokenId}`,
              query: {
                params: encodeParams(params),
              },
            }));
          });
      }
    })
    .catch(next);
});

myRouter.post('/reset-password/:tokenId', (req, res, next) => {
  const {
    password,
  } = req.body;

  return PatientUserReset.findOne({ where: { token: req.params.tokenId } })
    .then(async (reset) => {
      if (!reset) {
        return next(StatusError(401, 'Invalid Token'));
      }

      const user = await PatientUser.findOne({
        where: {
          id: reset.patientUserId,
        },
      });

      await user.setPasswordAsync(password);
      await user.save();
      await reset.destroy();
      return res.sendStatus(201);
    })
    .catch(next);
});

myRouter.get('/sentReminders/:sentReminderId/confirm', async (req, res, next) => {
  try {
    // TODO: it's stuff like this that we need to put into a "Manager" SentReminderManager.confirm();
    const sentReminder = req.sentReminder;
    await sentReminder.update({ isConfirmed: true });

    // For any confirmed reminder we confirm appointment
    const { appointment, patient, reminder } = sentReminder;

    if (appointment) {
      await appointment.confirm(reminder);
    }

    const account = await Account.findOne({
      where: {
        id: appointment.accountId,
      },
    });

    const appointmentJSON = appointment.get({ plain: true });
    const patientJSON = patient.get({ plain: true });
    const reminderJSON = reminder.get({ plain: true });

    const params = {
      patient: patientJSON,
      appointment: appointmentJSON,
      account: generateAccountParams(account),
      reminder: reminderJSON,
    };

    const encodedParams = encodeParams(params);

    const pub = req.app.get('pub');
    pub.publish('REMINDER:UPDATED', req.sentReminder.id);

    return res.redirect(url.format({
      pathname: `/sentReminders/${req.sentReminder.id}/confirmed`,
      query: {
        params: encodedParams,
      },
    }));
  } catch (err) {
    next(err);
  }
});

myRouter.get('(/*)?', (req, res, next) => {
  try {
    return res.render('my');
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
