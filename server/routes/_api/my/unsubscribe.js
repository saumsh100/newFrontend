
import { Router } from 'express';
import pick from 'lodash/pick';
import url from 'url';
import { isValidUUID } from '@carecru/isomorphic';
import {
  Account,
  Patient,
} from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';
import format from '../../util/format';

const unsubRouter = Router();

unsubRouter.param('patientId', sequelizeLoader('patient', 'Patient'));

/**
 * GET /:patientId/preferences
 * - used by the static unsubscribe pages to get the patient without all the other data
 *
 * - 201 sends down the created review data
 * - 404 :accountId does not exist
 */
unsubRouter.get('/patients/:patientId/preferences', async (req, res, next) => {
  // TODO: this needs to be tokenized
  try {
    const patient = req.patient.get({ plain: true });
    const safePatient = pick(patient, [
      'id',
      'firstName',
      'lastName',
      'preferences',
    ]);

    return res.send(format(req, res, 'patient', safePatient));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /:patientId/preferences
 * - used by the static unsubscribe pages to update the patient's preferences
 *
 * - 201 sends down the created review data
 * - 404 :accountId does not exist
 */
unsubRouter.put('/patients/:patientId/preferences', async (req, res, next) => {
  // TODO: this needs to be tokenized
  try {
    const { patient } = req;
    patient.preferences = Object.assign({}, patient.preferences, req.body);
    const savedPatient = await patient.save();
    const safePatient = pick(savedPatient.get({ plain: true }), [
      'id',
      'firstName',
      'lastName',
      'preferences',
    ]);

    return res.send(format(req, res, 'patient', safePatient));
  } catch (err) {
    next(err);
  }
});

/**
 *
 *
 */
unsubRouter.get('/unsubscribe/:encodedPatientId', async (req, res, next) => {
  // TODO: this needs to be tokenized
  try {
    let patientId = req.params.encodedPatientId;
    if (!isValidUUID(patientId)) {
      patientId = Buffer.from(patientId, 'base64').toString('utf8');
    }

    const patient = await Patient.findOne({ where: { id: patientId } });
    const account = await Account.findOne({ where: { id: patient.accountId } });
    if (account.fullLogoUrl) {
      account.fullLogoUrl = account.fullLogoUrl.replace('[size]', 'original');
    }

    const accountJSON = account.get({ plain: true });

    let params = {
      patient: { id: patientId },
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

    res.redirect(
      url.format({
        host: process.env.MY_HOST,
        pathname: '/unsubscribe',
        query: {
          params,
        },
      }),
    );
  } catch (err) {
    next(err);
  }
});

export default unsubRouter;
