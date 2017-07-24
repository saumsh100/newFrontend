
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
const { env, namespaces } = require('../../../config/globals');


requestsRouter.param('requestId', loaders('request', 'Request'));
requestsRouter.param('appointmentId', loaders('appointment', 'Appointment'));

/**
 * Create a request
 */
requestsRouter.post('/', (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const { patientUserId, accountId } = req.body;
  return Request.save(req.body)
    .then((request) => {
      const normalized = normalize('request', request);
      res.status(201).send(normalized);
      return { normalized };
    })
    .then(({ normalized }) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('create:Request', normalized);
    })
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
  const { accountId } = req;

  return req.request.merge(req.body).save()
    .then((request) => {
      const normalized = normalize('request', request);
      res.status(201).send(normalized);
      return { normalized };
    })
    .then(({ normalized }) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('update:Request', normalized);
    })
    .catch(next);
});


/**
 * Delete a request
 */
requestsRouter.delete('/:requestId', checkPermissions('requests:delete'), (req, res, next) =>{
  const { request, accountId } = req;

  return req.request.delete()
    .then(() => res.send(204))
    .then(() => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      const normalized = normalize('request', request);
      return io.of(ns).in(accountId).emit('remove:Request', normalized);
    })
    .catch(next);
});

/**
 * Send Rejected Request Email
 */
requestsRouter.put('/:requestId/reject', (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const { accountId, request } = req;
  return request.merge({ isCancelled: true }).save()
    .then((request) => {
      const normalized = normalize('request', request);
      res.status(201).send(normalized);
      return { normalized };
    })
    .then(({ normalized }) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('update:Request', normalized);
    })
    .then(async () => {
      const patientUser = await PatientUser.get(req.request.patientUserId);
      const account = await Account.get(accountId);
      const { email, firstName } = patientUser;
      const { name, phoneNumber, contactEmail, website } = account;
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
            content: name || '',
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: phoneNumber || '',
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: contactEmail || '',
          },
          {
            name: 'ACCOUNT_WEBSITE',
            content: website || '',
          },
        ],
      });
    })
    .catch(next);
});


/**
 * Send Confirmed Request Email
 */
requestsRouter.put('/:requestId/confirm/:appointmentId', checkPermissions('requests:update'), (req, res, next) =>{
  return req.request.merge({ isConfirmed: true }).save()
  .then(async () => {
    const patientUser = await PatientUser.get(req.request.patientUserId);
    const account = await Account.get(req.appointment.accountId);
    const { email, firstName } = patientUser;
    const { name, phoneNumber, contactEmail, website } = account;
    const { startDate } = req.appointment;
    // Send Email
    return sendAppointmentRequestConfirmed({
      toEmail: email,
      fromName: name,
      mergeVars: [
        {
          name: 'PATIENT_FIRSTNAME',
          content: firstName,
        },
        {
          name: 'ACCOUNT_NAME',
          content: name || '',
        },
        {
          name: 'ACCOUNT_PHONENUMBER',
          content: phoneNumber || '',
        },
        {
          name: 'ACCOUNT_CONTACTEMAIL',
          content: contactEmail || '',
        },
        {
          name: 'ACCOUNT_WEBSITE',
          content: website || '',
        },
        {
          name: 'APPOINTMENT_DATE',
          content: moment(startDate).format('MMMM Do YYYY'),
        },
        {
          name: 'APPOINTMENT_TIME',
          content: moment(startDate).format('h:mm:ss a'),
        },
      ],
    });
  })
  .then(() => {
    res.send(200);
  })
   .catch(next);
});

module.exports = requestsRouter;
