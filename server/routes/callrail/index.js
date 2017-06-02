
import { Router } from 'express';
import moment from 'moment';
import checkPermissions from '../../middleware/checkPermissions';
import loaders from '../util/loaders';
import Call from '../../models/Call';
import Patient from '../../models/Patient';

const callsRouter = Router();

// requestsRouter.param('requestId', loaders('request', 'Request'));

/**
 * Receive a new call from CallRail's webhook API
 */
callsRouter.post('/inbound/pre-call', (req, res, next) => {
  const { customer_phone_number } = req.body;
  const callData = {
    id: JSON.stringify(req.body.id),
  };

  Patient.findByPhoneNumber(customer_phone_number)
    .then((patient) => {
      console.log(`Received a call from ${patient.getFullName()}`);
      callData.patientId = patient.id;
      Call.save(Object.assign({}, req.body, callData));
    })
    .catch(() => {
      // Assume the Patient does not exist.
      console.log(`Received communication from unknown number: ${customer_phone_number}.`);
      Call.save(Object.assign({}, req.body, callData));
    });

  res.end();
});

/**
 * Call has ended from CallRail's webhook API
 */
callsRouter.post('/inbound/post-call', (req, res, next) => {
  const callData = {
    id: JSON.stringify(req.body.id),
  };

  // Update that message with the new status
  Call.get(callData.id).run()
    .then((call) => {
      return call.merge(Object.assign({}, req.body, callData)).save()
        .then(call => console.log(`Updated call ${call.id}!`));
    })
    .catch(next);

  // Needs a response
  res.end();
});

/**
 * Call has ended from CallRail's webhook API
 */
callsRouter.post('/inbound/modified', (req, res, next) => {
  // Update that message with the new status
  /*Call.get(req.body.id).run()
    .then((call) => {
      return call.merge(req.body).save()
        .then(call => console.log(`Updated call ${call.id}!`))
    })
    .catch(next);

  // Needs a response
  res.end();*/
  console.log('modified', req.body);
  res.end();
});


module.exports = callsRouter;
