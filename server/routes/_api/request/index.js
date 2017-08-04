

import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { SentReminder, PatientUser, Request, Service, Account } from '../../../_models';

import {
  sendAppointmentRequested,
  sendAppointmentRequestConfirmed,
  sendAppointmentRequestRejected,
} from '../../../lib/mail';
const { namespaces } = require('../../../config/globals');


const requestsRouter = Router();

requestsRouter.param('requestId', sequelizeLoader('request', 'Request'));
requestsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

/**
 * Create a request
 */
requestsRouter.post('/', (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const { patientUserId, accountId } = req.body;

  return Request.create(req.body)
    .then((request) => {
      const normalized = normalize('request', request.dataValues);
      res.status(201).send(normalized);
      return { request: request.dataValues };
    })
    .then(async ({ request }) => {
      if (request.patientUserId) {
        request.patientUser = await PatientUser.findById(request.patientUserId);
      }

      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('create:Request', normalize('request', request));
    })
    .then(async () => {
      const patientUser = await PatientUser.findById(patientUserId);
      const account = await Account.findById(accountId);
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
    includeArray,
  } = req;

  let { isCancelled } = req.query;

  isCancelled = !!isCancelled;

  return Request.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      isCancelled,
    },
    include: includeArray,
  }).then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

/**
 * Update a request
 */
requestsRouter.put('/:requestId', checkPermissions('requests:update'), (req, res, next) =>{
  const { accountId } = req;

  return req.request.update(req.body)
    .then((request) => {
      const normalized = normalize('request', request.dataValues);
      res.status(200).send(normalized);
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

  return req.request.destroy()
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
  return request.update({ isCancelled: true })
    .then((requestData) => {
      const normalized = normalize('request', requestData.dataValues);
      res.status(201).send(normalized);
      return { normalized };
    })
    .then(({ normalized }) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('update:Request', normalized);
    })
    .then(async () => {
      const patientUser = await PatientUser.findById(req.request.patientUserId);
      const account = await Account.findById(accountId);
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
  return req.request.update({ isConfirmed: true })
    .then(async (request) => {
      const patientUser = await PatientUser.findById(request.dataValues.patientUserId);
      const account = await Account.findById(request.dataValues.accountId);
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
