
import { Router } from 'express';
import moment from 'moment';
import checkPermissions from '../../middleware/checkPermissions';
import { sequelizeLoader } from '../util/loaders';
import { Patient, Call } from '../../_models';
import { namespaces } from '../../config/globals';
import { createCallRailAccount, updateCompanyName, updatePhoneNumber, disableCallRailAccount, getCallRailInformation } from '../../lib/thirdPartyIntegrations/callRail';
import normalize from '../_api/normalize';

import {
  getCellPhoneNumberFallback,
  whereCellPhoneNumber,
} from '../../lib/contactInfo/getPatientFromCellPhoneNumber';

const callRailRouter = Router();

// requestsRouter.param('requestId', loaders('request', 'Request'));
callRailRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * POST /:accountId
 * Create Call Rail account for CareCru account
 */
callRailRouter.post('/:accountId', async ({ account }, res, next) => {
  try {
    const updatedAccount = await createCallRailAccount(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /:accountId
 * Disable the Call Rail for an account.
 * Calling this will disable every service relating to this account.
 */
callRailRouter.delete('/:accountId', async ({ account }, res, next) => {
  try {
    await disableCallRailAccount(account);
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /:accountId
 * Retrieve the call rail account info for an account.
 */
callRailRouter.get('/:accountId', async ({ account }, res, next) => {
  try {
    return res.send(await getCallRailInformation(account));
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /:accountId/name
 * Change the callrail account name based on the account name
 */
callRailRouter.put('/:accountId/name', async ({ account }, res, next) => {
  try {
    return res.send(await updateCompanyName(account));
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /:accountId/phoneNumber
 * Change all the trackers with the oldPhoneNumber to the newPhoneNumber
 * body: {oldPhoneNumber, newPhoneNumber}
 */
callRailRouter.put(
  '/:accountId/phoneNumber',
  async ({ account, body: { oldPhoneNumber, newPhoneNumber } }, res, next) => {
    try {
      return res.send(await updatePhoneNumber(account, oldPhoneNumber, newPhoneNumber));
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Receive a new call from CallRail's webhook API
 */
callRailRouter.post('/:accountId/inbound/pre-call', async (req, res, next) => {
  const { callernum } = req.body;
  const callData = {
    id: JSON.stringify(req.body.id),
    accountId: req.account.id,
  };

  const data = {
    answered: req.body.answered === true, // callrails sometimes return an empty string for answered
    direction: req.body.direction,
    duration: req.body.duration,
    priorCalls: req.body.prior_calls,
    recording: req.body.recording,
    recordingDuration: req.body.recording_duration,
    startTime: req.body.start_time,
    totalCalls: req.body.total_calls,
    voicemail: req.body.voicemail,
    callerCity: req.body.callercity,
    callerCountry: req.body.callercountry,
    callerName: req.body.callername,
    callerNum: req.body.callernum,
    callerState: req.body.callerstate,
    callerZip: req.body.callerzip,
    campaign: req.body.campaign,
    destinationNum: req.body.destinationnum,
    trackingNum: req.body.trackingnum,
    wasApptBooked: req.body.wasApptBooked,
    callSource: req.body.formatted_tracking_source,
  };

  if (req.body.datetime) {
    data.dateTime = moment(req.body.datetime).toISOString();
  }

  const cellPhoneNumberFallback = await getCellPhoneNumberFallback(req.account.id);
  Patient.findOne({
    where: [{ accountId: req.account.id }, whereCellPhoneNumber(callernum, cellPhoneNumberFallback)],
    raw: true,
  })
    .then((patient) => {
      if (patient) {
        console.log(`Received a call from ${patient.firstName} ${patient.lastName}`);
        callData.patientId = patient.id;
        return Call.create(Object.assign({}, data, callData));
      }
      console.log(`Received communication from unknown number: ${callernum}.`);
      return Call.create(Object.assign({}, data, callData));
    })
    .then((call) => {
      const pub = req.app.get('pub');
      pub.publish('call.started', call.id);
    });

  return res.sendStatus(201);
  // res.end();
});

/**
 * Call has ended from CallRail's webhook API
 */
callRailRouter.post('/:accountId/inbound/post-call', (req, res, next) => {
  const callData = {
    id: JSON.stringify(req.body.id),
    accountId: req.account.id,
  };

  const data = {
    answered: req.body.answered === true, // callrails sometimes return an empty string for answered
    direction: req.body.direction,
    duration: req.body.duration,
    priorCalls: req.body.prior_calls,
    recording: req.body.recording,
    recordingDuration: req.body.recording_duration,
    startTime: req.body.start_time,
    totalCalls: req.body.total_calls,
    voicemail: req.body.voicemail,
    callerCity: req.body.callercity,
    callerCountry: req.body.callercountry,
    callerName: req.body.callername,
    callerNum: req.body.callernum,
    callerState: req.body.callerstate,
    callerZip: req.body.callerzip,
    campaign: req.body.campaign,
    destinationNum: req.body.destinationnum,
    trackingNum: req.body.trackingnum,
    wasApptBooked: req.body.wasApptBooked,
    callSource: req.body.formatted_tracking_source,
  };

  if (req.body.datetime) {
    data.datetime = moment(req.body.datetime).toISOString();
  }

  // Update that message with the new status
  Call.update(data, { where: { id: callData.id } })
    .then(() => {
      console.log(`Updated call ${callData.id}!`);
      const pub = req.app.get('pub');
      pub.publish('call.ended', callData.id);
    })
    .catch(next);

  // TODO: this needs to be wrapped in a try catch
  // Needs a response
  res.sendStatus(201);
});

/**
 * Call has ended from CallRail's webhook API
 */
callRailRouter.post('/:accountId/inbound/modified', (req, res, next) => {
  const callData = {
    id: JSON.stringify(req.body.id),
    accountId: req.account.id,
  };

  const data = {
    answered: req.body.answered === true, // callrails sometimes return an empty string for answered
    direction: req.body.direction,
    duration: req.body.duration,
    priorCalls: req.body.prior_calls,
    recording: req.body.recording,
    recordingDuration: req.body.recording_duration,
    startTime: req.body.start_time,
    totalCalls: req.body.total_calls,
    voicemail: req.body.voicemail,
    callerCity: req.body.callercity,
    callerCountry: req.body.callercountry,
    callerName: req.body.callername,
    callerNum: req.body.callernum,
    callerState: req.body.callerstate,
    callerZip: req.body.callerzip,
    campaign: req.body.campaign,
    destinationNum: req.body.destinationnum,
    trackingNum: req.body.trackingnum,
    wasApptBooked: req.body.wasApptBooked,
    callSource: req.body.formatted_tracking_source,
  };

  if (req.body.datetime) {
    data.datetime = moment(req.body.datetime).toISOString();
  }

  // Update that message with the new status
  Call.update(data, { where: { id: callData.id } })
    .then(() => {
      console.log(`Modified call ${callData.id}!`);
    })
    .catch(next);

  // TODO: this needs to be wrapped in a try catch
  // Needs a response
  res.sendStatus(201);
});


module.exports = callRailRouter;
