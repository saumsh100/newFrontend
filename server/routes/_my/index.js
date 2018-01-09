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
import sentReviewsRouter from './sentReviews';
import widgetsRouter from './widgets';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import {
  Account,
  Appointment,
  Patient,
  PatientUser,
  Practitioner,
  PatientUserReset,
} from '../../_models';
import { validatePhoneNumber } from '../../util/validators';
import { sequelizeLoader } from '../util/loaders';
import normalize from '../_api/normalize';

const sequelizeMyRouter = Router();

sequelizeMyRouter.use('/', newAvailabilitiesRouter);
sequelizeMyRouter.use('/requests', sequelizeAuthMiddleware, requestRouter);
sequelizeMyRouter.use('/waitSpots', sequelizeAuthMiddleware, waitSpotsRouter);
sequelizeMyRouter.use('/auth', authRouter);

sequelizeMyRouter.param('sentReminderId', sequelizeLoader('sentReminder', 'SentReminder', [
  { model: Appointment, as: 'appointment' },
  { model: Patient, as: 'patient' },
]));

sequelizeMyRouter.param('accountId', sequelizeLoader('account', 'Account'));
sequelizeMyRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
sequelizeMyRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

sequelizeMyRouter.use('/reviews', reviewsRouter);
sequelizeMyRouter.use('/sentReviews', sentReviewsRouter);
sequelizeMyRouter.use('/widgets', widgetsRouter);

sequelizeMyRouter.post('/patientUsers/email', async (req, res, next) => {
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

sequelizeMyRouter.post('/patientUsers/phoneNumber', async (req, res, next) => {
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
      type: 'carrier'
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


sequelizeMyRouter.get('/patientUsers/:patientUserId', (req, res, next) => {
  const patientUser = req.patientUser.get({ plain: true });
  delete patientUser.password;
  try {
    res.json(patientUser);
  } catch (err) {
    next(err);
  }
});

sequelizeMyRouter.get('/unsubscribe/:patientId', async (req, res, next) => {
  try {
    const regUuidTest = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    let patientId = req.params.patientId;

    if (!regUuidTest.test(patientId)) {
      patientId = Buffer.from(patientId, 'base64').toString('utf8');
    }

    const patient = await Patient.findOne({ where: { id: patientId } });

    const preferences = Object.assign({}, patient.preferences);
    preferences.reminders = false;

    await patient.update({ preferences });

    let account = await Account.findOne({
      where: {
        id: patient.accountId,
      },
    });

    let fullLogoUrl = account.fullLogoUrl;

    if (account.fullLogoUrl) {
      fullLogoUrl = fullLogoUrl.replace('[size]', 'original');
    }

    account = account.get({ plain: true });

    delete account.address.id;

    let params = {
      name: account.name,
      address: account.address,
      facebookUrl: account.facebookUrl,
      phoneNumber: account.phoneNumber,
      email: account.contactEmail,
      fullLogoUrl,
    };

    params = JSON.stringify(params);

    params = new Buffer(params).toString('base64');

    return res.redirect(url.format({
      pathname: '/unsubscribe/',
      query: {
        params,
      },
    }));
  } catch (err) {
    next(err);
  }
});

sequelizeMyRouter.get('/reset/:tokenId', (req, res, next) => {
  return PatientUserReset.findOne({ where: { token: req.params.tokenId } })
    .then((reset) => {
      if (!reset) {
        // TODO: replace with StatusError
        res.status(404).send();
      } else {
        res.redirect(`/reset-password/${req.params.tokenId}`);
      }
    })
    .catch(next);
});

sequelizeMyRouter.post('/reset-password/:tokenId', (req, res, next) => {
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

sequelizeMyRouter.get('/sentReminders/:sentReminderId/confirm', async (req, res, next) => {
  try {
    const sentReminder = req.sentReminder;
    await sentReminder.update({ isConfirmed: true });

    // For any confirmed reminder we confirm appointment
    const { appointment, patient } = sentReminder;

    if (appointment) {
      await appointment.update({ isPatientConfirmed: true });
    }

    const account = await Account.findOne({
      where: {
        id: appointment.accountId,
      },
    });

    if (account.fullLogoUrl) {
      account.fullLogoUrl = account.fullLogoUrl.replace('[size]', 'original');
    }

    const accountJSON = account.get({ plain: true });
    const appointmentJSON = appointment.get({ plain: true });
    const patientJSON = patient.get({ plain: true });

    let params = {
      patient: patientJSON,
      appointment: appointmentJSON,
      account: pick(accountJSON, [
        'name',
        'address',
        'website',
        'contactEmail',
        'phoneNumber',
        'fullLogoUrl',
        'facebookUrl',
        'googlePlaceId',
        'bookingWidgetPrimaryColor',
      ]),
    };

    params = JSON.stringify(params);
    params = new Buffer(params).toString('base64');

    const pub = req.app.get('pub');
    pub.publish('REMINDER:UPDATED', req.sentReminder.id);

    return res.redirect(url.format({
      pathname: `/sentReminders/${req.sentReminder.id}/confirmed`,
      query: {
        params,
      },
    }));
  } catch (err) {
    next(err);
  }
});

sequelizeMyRouter.get('(/*)?', (req, res, next) => {
  try {
    return res.render('my');
  } catch (err) {
    next(err);
  }
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
/*sequelizeMyRouter.use('(/*)?', (req, res, next) => {
  // TODO: this needs to be wrapped in try catch
  return res.status(404).end();
});*/

module.exports = sequelizeMyRouter;
