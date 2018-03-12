

import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import jsonapi from '../../util/jsonapi';
import { Permission, PatientUser, Request, User, Account } from '../../../_models';
import linkRequestWithPendingAppointment from '../../../lib/linkRequestWithPendingAppointment';

import {
  sendAppointmentRequested,
  sendAppointmentRequestConfirmed,
  sendAppointmentRequestRejected,
  sendAppointmentRequestedClinic,
} from '../../../lib/mail';

const { namespaces } = require('../../../config/globals');


const requestsRouter = Router();

requestsRouter.param('requestId', sequelizeLoader('request', 'Request'));
requestsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

/**
 * Create a request
 */
requestsRouter.post('/', async (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const {
    patientUserId,
    accountId,
    sentRecallId,
  } = req.body;

  const newRequest = Object.assign({}, req.body,
    await linkRequestWithPendingAppointment(sentRecallId));

  return Request.create(newRequest)
    .then((request) => {
      const normalized = normalize('request', request.dataValues);
      res.status(201).send(normalized);
      return { request: request.dataValues };
    })
    .then(async ({ request }) => {
      if (request.patientUserId) {
        const pUser = await PatientUser.findById(request.patientUserId);
        request.patientUser = pUser.get({ plain: true });
      }

      const pub = req.app.get('pub');
      pub.publish('request.created', request.id);
    })
    .then(async () => {
      const patientUser = await PatientUser.findById(patientUserId);
      const account = await Account.findById(accountId);
      const users = await User.findAll({
        raw: true,
        nest: true,
        include: [{
          model: Permission,
          as: 'permission',
          where: {
            role: {
              $ne: 'SUPERADMIN',
            },
          },
          required: true,
        }],
        where: {
          activeAccountId: accountId,
        },
      });
      const { email, firstName, lastName } = patientUser;
      const { name, sendRequestEmail } = account;
      // Send Email

      if (sendRequestEmail) {
        for (let i = 0; i < users.length; i += 1) {
          const emailDomain = users[i].username.split('@')[1];
          if (!/carecru/i.test(emailDomain)) {
            sendAppointmentRequestedClinic({
              toEmail: users[i].username,
              mergeVars: [
                {
                  name: 'PATIENT_FIRSTNAME',
                  content: firstName,
                },
                {
                  name: 'PATIENT_LASTNAME',
                  content: lastName,
                },
                {
                  name: 'USER_NAME',
                  content: users[i].firstName,
                },
                {
                  name: 'ACCOUNT_WEBSITE',
                  content: 'https://carecru.io/',
                },
                {
                  name: 'ACCOUNT_CLINICNAME',
                  content: name,
                },
                {
                  name: 'APPOINTMENT_DATE',
                  content: moment(req.body.startDate).format('MMMM Do YYYY'),
                },
                {
                  name: 'APPOINTMENT_TIME',
                  content: moment(req.body.startDate).format('h:mm a'),
                },
              ],
            });
          }
        }
      }

      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
      sendAppointmentRequested({
        accountId: req.accountId,
        toEmail: email,
        fromName: name,
        mergeVars: [
          {
            name: 'PRIMARY_COLOR',
            content: account.bookingWidgetPrimaryColor || '#206477',
          },
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'ACCOUNT_CLINICNAME',
            content: name,
          },
          {
            name: 'ACCOUNT_LOGO_URL',
            content: accountLogoUrl,
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: account.phoneNumber,
          },
          {
            name: 'ACCOUNT_CITY',
            content: account.address.city,
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: account.contactEmail,
          },
          {
            name: 'ACCOUNT_ADDRESS',
            content: account.address.street,
          },
          {
            name: 'APPOINTMENT_DATE',
            content: moment(req.body.startDate).format('MMMM Do YYYY'),
          },
          {
            name: 'APPOINTMENT_TIME',
            content: moment(req.body.startDate).format('h:mm a'),
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
    where: {
      accountId,
      isCancelled,
    },

    include: includeArray,
  }).then(requests => {
    const sendRequests = requests.map(r => r.get({ plain: true }));
    return res.send(normalize('requests', sendRequests));
  })
    .catch(next);
});

/**
 * Get all requests that need to be synced
 */
requestsRouter.get('/notSynced', (req, res, next) => {
  const {
    accountId,
  } = req;


  return Request.findAll({
    where: {
      accountId,
      isSyncedWithPms: false,
      suggestedPractitionerId: {
        $ne: null,
      },
      suggestedChairId: {
        $ne: null,
      },
    },
    include: [{
      model: PatientUser,
      as: 'patientUser',
    }],
  }).then((requests) => {
    const sendRequests = requests.map(r => r.get({ plain: true }));
    const normalized = jsonapi('request', sendRequests);
    return res.send(normalized);
  })
    .catch(next);
});

/**
 * Update a request
 */
requestsRouter.put('/:requestId', checkPermissions('requests:update'), (req, res, next) =>{
  const { accountId } = req;

  req.body.isSyncedWithPms = false;

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
 * Update a request
 */
requestsRouter.put('/:requestId/connector', checkPermissions('requests:update'), (req, res, next) =>{
  const { accountId } = req;

  req.body.isSyncedWithPms = true;

  return req.request.update(req.body)
    .then((request) => {
      const normalized = jsonapi('request', request);
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
  return request.update({ isCancelled: true, isSyncedWithPms: false })
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
      const { startDate } = req.request;
      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

      // Send Email
      sendAppointmentRequestRejected({
        accountId: req.accountId,
        toEmail: email,
        fromName: name,
        mergeVars: [
          {
            name: 'PRIMARY_COLOR',
            content: account.bookingWidgetPrimaryColor || '#206477',
          },
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'ACCOUNT_CLINICNAME',
            content: name,
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: phoneNumber,
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: contactEmail,
          },
          {
            name: 'ACCOUNT_WEBSITE',
            content: website,
          },
          {
            name: 'ACCOUNT_LOGO_URL',
            content: accountLogoUrl,
          },
          {
            name: 'ACCOUNT_CITY',
            content: account.address.city,
          },
          {
            name: 'ACCOUNT_ADDRESS',
            content: account.address.street,
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
    .catch(next);
});


/**
 * Send Confirmed Request Email
 */
requestsRouter.put('/:requestId/confirm/:appointmentId', checkPermissions('requests:update'), (req, res, next) =>{
  return req.request.update({
    isConfirmed: true,
    appointmentId: req.appointmentId,
    isSyncedWithPms: false,
  })
    .then(async (request) => {
      const patientUser = await PatientUser.findById(request.dataValues.patientUserId);
      const account = await Account.findById(request.dataValues.accountId);
      const { email, firstName } = patientUser;
      const { name, phoneNumber, contactEmail, website } = account;
      const { startDate } = req.appointment;

      // Early return so its not dependant on email sending
      res.status(200).send();

      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      const normalized = normalize('request', request.dataValues);
      io.of(ns).in(request.dataValues.accountId).emit('update:Request', normalized);
      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

      // Send Email
      return sendAppointmentRequestConfirmed({
        accountId: req.accountId,
        toEmail: email,
        fromName: name,
        mergeVars: [
          {
            name: 'PRIMARY_COLOR',
            content: account.bookingWidgetPrimaryColor || '#206477',
          },
          {
            name: 'PATIENT_FIRSTNAME',
            content: firstName,
          },
          {
            name: 'ACCOUNT_CLINICNAME',
            content: name,
          },
          {
            name: 'ACCOUNT_PHONENUMBER',
            content: phoneNumber,
          },
          {
            name: 'ACCOUNT_CONTACTEMAIL',
            content: contactEmail,
          },
          {
            name: 'ACCOUNT_WEBSITE',
            content: website,
          },
          {
            name: 'ACCOUNT_LOGO_URL',
            content: accountLogoUrl,
          },
          {
            name: 'ACCOUNT_CITY',
            content: account.address.city,
          },
          {
            name: 'ACCOUNT_ADDRESS',
            content: account.address.street,
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
    .catch(next);
});

module.exports = requestsRouter;
