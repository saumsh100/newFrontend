

import { Router } from 'express';
import { namespaces, protocol, host } from '../../../config/globals';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import jsonapi from '../../util/jsonapi';
import { Permission, PatientUser, Request, User, Account, Service, Practitioner } from '../../../_models';
import linkRequestWithPendingAppointment from '../../../lib/linkRequestWithPendingAppointment';
import { formatPhoneNumber } from '../../../util/formatters';
import { setDateToTimezone } from '../../../util/time';
import { appointmentRequestNoteStringFormatter } from '../../../lib/appointmentRequestNoteStringFormatter';
import {
  sendAppointmentRequested,
  sendAppointmentRequestConfirmed,
  sendAppointmentRequestRejected,
  sendAppointmentRequestedClinic,
} from '../../../lib/mail';

const requestsRouter = Router();

requestsRouter.param('requestId', sequelizeLoader('request', 'Request'));
requestsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

/**
 * Create a request
 */
requestsRouter.post('/', async (req, res, next) => {
  // TODO: patientUserId should be pulled from auth
  const requestData = req.body;
  const {
    patientUserId,
    accountId,
  } = requestData;

  const hasPendingAppt = await linkRequestWithPendingAppointment(requestData);
  const newRequestData = Object.assign(
    {},
    requestData,
    { isSyncedWithPms: hasPendingAppt },
  );

  return Request.create(newRequestData)
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

      const io = req.app.get('socketio');
      io && io.of(namespaces.dash)
        .in(accountId)
        .emit('request.created', normalize('request', request));

      if (patientUserId !== request.requestingPatientUserId) {
        const patientUserFor = await PatientUser.findById(patientUserId);
        const { firstName } = patientUserFor;
        return {
          patientRequestingId: request.requestingPatientUserId,
          requestForName: firstName,
        };
      }

      return {
        patientRequestingId: patientUserId,
        requestForName: null,
      };
    })
    .then(async ({ patientRequestingId, requestForName }) => {
      const patientUser = await PatientUser.findById(patientRequestingId);
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
          sendBookingRequestEmail: true,
        },
      });
      const { email, firstName, lastName } = patientUser;
      const { name, sendRequestEmail, timezone } = account;

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
                  content: `${protocol}://${host}/`,
                },
                {
                  name: 'ACCOUNT_CLINICNAME',
                  content: name,
                },
                {
                  name: 'APPOINTMENT_DATE',
                  content: setDateToTimezone(req.body.startDate, timezone).format('MMMM Do YYYY'),
                },
                {
                  name: 'APPOINTMENT_TIME',
                  content: setDateToTimezone(req.body.startDate, timezone).format('h:mm a'),
                },
              ],
            });
          }
        }
      }

      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
      const googlePlaceId = account.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}` : null;

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
            content: formatPhoneNumber(account.phoneNumber),
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
            content: setDateToTimezone(req.body.startDate, timezone).format('MMMM Do YYYY'),
          },
          {
            name: 'APPOINTMENT_TIME',
            content: setDateToTimezone(req.body.startDate, timezone).format('h:mm a'),
          },
          {
            name: 'PATIENT_REQUEST_FOR',
            content: requestForName,
          },
          {
            name: 'FACEBOOK_URL',
            content: account.facebookUrl,
          },
          {
            name: 'GOOGLE_URL',
            content: googlePlaceId,
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
    },
    {
      model: PatientUser,
      as: 'requestingPatientUser',
    },
    {
      model: Service,
      as: 'service',
    },
    {
      model: Account,
      as: 'account',
    },
    {
      model: Practitioner,
      as: 'practitioner',
    }],
  }).then((requests) => {
    const sendRequests = requests.map((request) => {
      const r = request.get({ plain: true });
      return {
        ...r,
        formattedNote: appointmentRequestNoteStringFormatter(r),
      };
    });
    return res.send(jsonapi('request', sendRequests));
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
    .then(() => res.sendStatus(204))
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
    .then(async ({ normalized }) => {
      const patientUserId = req.request.patientUserId;
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      io.of(ns).in(accountId).emit('update:Request', normalized);

      if (patientUserId !== request.requestingPatientUserId) {
        const patientUserFor = await PatientUser.findById(patientUserId);
        const { firstName } = patientUserFor;
        return {
          patientRequestingId: request.requestingPatientUserId,
          requestForName: firstName,
        };
      }

      return {
        patientRequestingId: patientUserId,
        requestForName: null,
      };
    })
    .then(async ({ patientRequestingId, requestForName }) => {
      const patientUser = await PatientUser.findById(patientRequestingId);
      const account = await Account.findById(accountId);
      const { email, firstName } = patientUser;
      const { name, phoneNumber, contactEmail, website, timezone } = account;
      const { startDate } = req.request;
      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

      const googlePlaceId = account.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}` : null;

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
            content: formatPhoneNumber(phoneNumber),
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
            content: setDateToTimezone(startDate, timezone).format('MMMM Do YYYY'),
          },
          {
            name: 'APPOINTMENT_TIME',
            content: setDateToTimezone(startDate, timezone).format('h:mm a'),
          },
          {
            name: 'PATIENT_REQUEST_FOR',
            content: requestForName,
          },
          {
            name: 'FACEBOOK_URL',
            content: account.facebookUrl,
          },
          {
            name: 'GOOGLE_URL',
            content: googlePlaceId,
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
      const requestClean = request.get({ plain: true });
      let patientUserId = requestClean.patientUserId;

      let requestForName = null;

      if (patientUserId !== requestClean.requestingPatientUserId) {
        patientUserId = requestClean.requestingPatientUserId;

        const patientUserFor = await PatientUser.findById(requestClean.patientUserId);
        const { firstName } = patientUserFor;
        requestForName = firstName;
      }

      const patientUser = await PatientUser.findById(patientUserId);

      const account = await Account.findById(requestClean.accountId);
      const { email, firstName } = patientUser;

      const { name, phoneNumber, contactEmail, website, timezone } = account;
      const { startDate } = req.appointment;

      // Early return so its not dependant on email sending
      res.status(200).send();

      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      const normalized = normalize('request', requestClean);
      io.of(ns).in(requestClean.accountId).emit('update:Request', normalized);

      const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
      const googlePlaceId = account.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}` : null;

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
            content: formatPhoneNumber(phoneNumber),
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
            content: setDateToTimezone(startDate, timezone).format('MMMM Do YYYY'),
          },
          {
            name: 'APPOINTMENT_TIME',
            content: setDateToTimezone(startDate, timezone).format('h:mm a'),
          },
          {
            name: 'PATIENT_REQUEST_FOR',
            content: requestForName,
          },
          {
            name: 'FACEBOOK_URL',
            content: account.facebookUrl,
          },
          {
            name: 'GOOGLE_URL',
            content: googlePlaceId,
          },
        ],
      });
    })
    .catch(next);
});

module.exports = requestsRouter;
