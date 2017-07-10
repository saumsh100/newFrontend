
const requestsRouter = require('express').Router();
const moment = require('moment');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const { Account, PatientUser, Request, Service } = require('../../../models');
const {
  sendAppointmentRequested,
  sendAppointmentRequestConfirmed,
  sendAppointmentRequestRejected,
} = require('../../../lib/mail');

requestsRouter.param('requestId', loaders('request', 'Request'));

/**
 * Create a request
 */
requestsRouter.post('/', (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const { patientUserId, accountId } = req.body;
  return Request.save(req.body)
    .then(request => res.status(201).send(normalize('request', request)))
    .then(async () => {
      const patientUser = await PatientUser.get(patientUserId);
      const account = await Account.get(accountId);
      const { email, firstName } = patientUser;
      const { name } = account;
      // Send Email
      sendAppointmentRequested({
        toEmail: email,
        fromName: name,
        mergeVars: [
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'ACCOUNT_NAME',
            content: name,
          },
        ],
      });
    })
    .catch(next);
});

/**
 * Get all requests
 */
requestsRouter.get('/', (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

 const { isCancelled } = req.query;
 let filter = isCancelled? { accountId, isCancelled: true } : { accountId, isCancelled: false }

  return Request.filter(filter).getJoin(joinObject).run()
    .then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

/**
 * Update a request
 */
requestsRouter.put('/:requestId', checkPermissions('requests:update'), (req, res, next) =>{
  return req.request.merge(req.body).save()
    .then(request => res.send(normalize('request', request)))
    .catch(next);
});

/**
 * Delete a request
 */
requestsRouter.delete('/:requestId', checkPermissions('requests:delete'), (req, res, next) =>{
  return req.request.delete()
    .then(() =>{
        res.send(204);
    })
    .catch(next);
});

/**
 * Send Rejected Request Email
 */
requestsRouter.post('/:requestId/reject', (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const { accountId, request } = req;
  return request.merge({ isCancelled: true }).save()
    .then(r => res.status(201).send(normalize('request', r)))
    .then(async () => {
      const patientUser = await PatientUser.get(patientUserId);
      const account = await Account.get(accountId);
      const { email, firstName } = patientUser;
      const { name } = account;
      // Send Email
      sendAppointmentRequestRejected({
        toEmail: email,
        fromName: name,
        mergeVars: [
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'ACCOUNT_NAME',
            content: name,
          },
        ],
      });
    })
    .catch(next);
});


/**
 * Send Confirmed Request Email
 */

module.exports = requestsRouter;
