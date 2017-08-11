
import { Router } from 'express';
import moment from 'moment';
import checkPermissions from '../../middleware/checkPermissions';
import { sequelizeLoader } from '../util/loaders';
import { Patient, Call } from '../../_models';
import { namespaces } from '../../config/globals';

const callsRouterSequelize = Router();

// requestsRouter.param('requestId', loaders('request', 'Request'));
callsRouterSequelize.param('accountId', sequelizeLoader('account', 'Account'));


/**
 * Receive a new call from CallRail's webhook API
 */
callsRouterSequelize.post('/:accountId/inbound/pre-call', (req, res, next) => {
  const { customer_phone_number } = req.body;
  const callData = {
    id: JSON.stringify(req.body.id),
    accountId: req.account.id,
  };

  const data = {
    answered: req.body.answered,
    direction: req.body.answered,
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
    callSource: req.body.callsource,
  };

  if (req.body.datetime) {
    data.dateTime = moment(req.body.datetime).toISOString();
  }

  Patient.findOne({ where: { mobilePhoneNumber: customer_phone_number }, raw: true })
    .then((patient) => {
      if (patient) {
        console.log(`Received a call from ${patient.firstName} ${patient.lastName}`);
        callData.patientId = patient.id;
        Call.create(Object.assign({}, data, callData));
      } else {
        console.log(`Received communication from unknown number: ${customer_phone_number}.`);
        Call.create(Object.assign({}, data, callData));
      }
    }).then(() => {
      const io = req.app.get('socketio');
      return io.of(namespaces.dash).in(req.account.id).emit('receivedCall', data);
    });

  res.status(201).send(201);
  // res.end();
});

/**
 * Call has ended from CallRail's webhook API
 */
callsRouterSequelize.post('/:accountId/inbound/post-call', (req, res, next) => {
  const callData = {
    id: JSON.stringify(req.body.id),
    accountId: req.account.id,
  };

  const data = {
    answered: req.body.answered,
    direction: req.body.answered,
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
    callSource: req.body.callsource,
  };

  if (req.body.datetime) {
    data.datetime = moment(req.body.datetime).toISOString();
  }

  // Update that message with the new status
  Call.update(data, { where: { id: callData.id } })
    .then(() => {
      console.log(`Updated call ${callData.id}!`);
    })
    .catch(next);

  // TODO: this needs to be wrapped in a try catch
  // Needs a response
  res.status(201).send();
});

/**
 * Call has ended from CallRail's webhook API
 */
callsRouterSequelize.post('/:accountId/inbound/modified', (req, res, next) => {
  // Update that message with the new status
  /*Call.get(req.body.id).run()
    .then((call) => {
      return call.merge(req.body).save()
        .then(call => console.log(`Updated call ${call.id}!`))
    })
    .catch(next);

  // Needs a response
  res.end();*/
  // TODO: this needs to be wrapped in a try catch
  res.end();
});


module.exports = callsRouterSequelize;
