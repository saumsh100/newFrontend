
import isArray from 'lodash/isArray';
import { Router } from 'express';
import moment from 'moment';
import { Appointment, Chat, Patient } from 'CareCruModels';
import format from '../../util/format';
import batchCreate, { batchUpdate } from '../../util/batch';
import { updateChatAfterPatient } from '../../util/preUpdateFunctions';
import { mostBusinessSinglePatient } from '../../../lib/intelligence/revenue';
import checkPermissions from '../../../middleware/checkPermissions';
import checkIsArray from '../../../middleware/checkIsArray';
import normalize from '../normalize';
import { sequelizeLoader } from '../../util/loaders';
import { namespaces } from '../../../config/globals';
import patientEventsAggregator from '../../../lib/events';
import getPatientBasedOnFieldsProvided from '../../../lib/contactInfo/getPatient';
import StatusError from '../../../util/StatusError';
import {
  whereCellPhoneNumber,
  getCellPhoneNumberFallback,
} from '../../../lib/contactInfo/getPatientFromCellPhoneNumber';
import { getOrCreateChatForPatient } from '../../../services/chat';

const patientsRouter = new Router();

const emitSocketIo = async ({ app, accountId }, patient, events) => {
  const io = app.get('socketio');
  const ns = patient.isSyncedWithPms ? namespaces.dash : namespaces.sync;

  return (
    io &&
    events.map(({ key, value }) =>
      io
        .of(ns)
        .in(accountId)
        .emit(key, value))
  );
};

patientsRouter.param('patientId', sequelizeLoader('patient', 'Patient'));

const eventsRouter = new Router();

patientsRouter.get('/:patientId/events', eventsRouter);

patientsRouter.get(
  '/:patientId/stats',
  checkPermissions('patients:read'),
  async (req, res, next) => {
    const startDate = moment()
      .subtract(1, 'years')
      .toISOString();
    const endDate = moment().toISOString();

    const stats = {
      allApps: 0,
      monthsApp: 0,
      lastAppointment: null,
    };

    try {
      const appointmentsInDateRangeCount = await Appointment.count({
        raw: true,
        where: {
          patientId: req.patient.id,
          startDate: { $between: [startDate, endDate] },
        },
      });

      const appointmentsAllTimePast = await Appointment.findAll({
        raw: true,
        where: {
          patientId: req.patient.id,
          startDate: {
            $between: [moment('1970-01-01').toISOString(), endDate],
          },
          isDeleted: false,
          isCancelled: false,
        },
        order: [['startDate', 'DESC']],
      });

      const appointmentsAllTimeNext = await Appointment.findAll({
        raw: true,
        where: {
          patientId: req.patient.id,
          startDate: {
            $between: [
              endDate,
              moment(endDate)
                .add(100, 'years')
                .toISOString(),
            ],
          },
          isDeleted: false,
          isCancelled: false,
        },
        order: [['startDate', 'ASC']],
        limit: 1,
      });

      const mostRecentAppointmentDate = appointmentsAllTimePast[0]
        ? appointmentsAllTimePast[0].startDate
        : null;

      const totalAppointmentCount = await Appointment.count({
        where: { patientId: req.patient.id },
      });

      const productionCalendarYear = await mostBusinessSinglePatient(
        moment()
          .subtract(1, 'years')
          .toISOString(),
        new Date(),
        req.accountId,
        [req.patient.id],
        [],
      );

      stats.allApps = totalAppointmentCount;
      stats.monthsApp = appointmentsInDateRangeCount;
      stats.lastAppointment = mostRecentAppointmentDate;
      stats.nextAppointment = appointmentsAllTimeNext[0]
        ? appointmentsAllTimeNext[0].startDate
        : null;
      stats.productionCalendarYear = productionCalendarYear[0]
        ? productionCalendarYear[0].totalAmount
        : null;

      return res.send(stats);
    } catch (error) {
      next(error);
    }
  },
);

patientsRouter.get(
  '/:patientId/chat',
  checkPermissions('patients:read'),
  async ({ patient }, res, next) => {
    const { id: chatId } = await getOrCreateChatForPatient(
      patient.accountId,
      patient.cellPhoneNumber,
      patient,
    );

    res.send({
      chatId,
    });
  },
);

patientsRouter.get('/search', checkPermissions('patients:read'), async (req, res, next) => {
  const searchString = req.query.patients || '';
  const { patientId } = req.query;
  const search = searchString.split(' ');

  let normPatients;

  // making search case insensitive as
  const phoneSearch = `%${search[0].replace(/\D/g, '')}`;
  const startDate = moment().toISOString();
  const endDate = moment()
    .add(1, 'years')
    .toISOString();

  let searchClause;
  if (search[1]) {
    searchClause = {
      where: {
        accountId: req.accountId,
        $or: [
          {
            firstName: { $iLike: `${search[0]}%` },
            lastName: { $iLike: `${search[1]}%` },
          },
          {
            firstName: { $iLike: `${search[1]}%` },
            lastName: { $iLike: `${search[0]}%` },
          },
        ],
      },
    };
  } else {
    searchClause = {
      where: {
        accountId: req.accountId,
        $or: [
          { firstName: { $iLike: `${search[0]}%` } },
          { lastName: { $iLike: `${search[0]}%` } },
          { email: { $iLike: `${search[0]}%` } },
        ],
      },
    };
    if (phoneSearch !== '%') {
      searchClause.where.$or.push({
        mobilePhoneNumber: { $like: phoneSearch },
      });
      searchClause.where.$or.push({
        homePhoneNumber: { $like: phoneSearch },
      });
      searchClause.where.$or.push({
        workPhoneNumber: { $like: phoneSearch },
      });
      searchClause.where.$or.push({
        otherPhoneNumber: { $like: phoneSearch },
      });
    }
  }
  if (!searchString && !!patientId) {
    searchClause = {
      where: {
        accountId: req.accountId,
        id: patientId,
      },
    };
  }

  try {
    const queryPatients = await Patient.findAll(
      Object.assign(
        {
          limit: 50,
          order: [['firstName', 'ASC']],
          include: [
            {
              association: 'appointments',
              required: false,
              where: { startDate: { $between: [startDate, endDate] } },
            },
            {
              association: 'chats',
              required: false,
              where: {
                patientPhoneNumber: { $col: 'Patient.cellPhoneNumber' },
              },
              include: [
                {
                  association: 'textMessages',
                  required: false,
                  limit: 1,
                  order: [['createdAt', 'DESC']],
                  include: [
                    {
                      association: 'user',
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        searchClause,
      ),
    );

    const patients = queryPatients.map(queryPatient => queryPatient.get({ plain: true }));

    const beginningCheck1 = new RegExp(`^${search[0]}`, 'i');
    const beginningCheck2 = search[1] ? new RegExp(`${search[0]}`, 'i') : null;

    const anyCheck1 = new RegExp(search[0], 'i');
    const anyCheck2 = search[1] ? new RegExp(search[0], 'i') : null;

    const word1Length = search[0].length;
    const word2Length = search[1] ? search[1].length : null;

    const patientsSort = patients.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      aValue += beginningCheck1.test(a.firstName) ? word1Length + 1 : 0;
      aValue += anyCheck1.test(a.firstName) ? word1Length + 1 : 0;
      aValue += beginningCheck1.test(a.lastName) ? word1Length : 0;
      aValue += anyCheck1.test(a.lastName) ? word1Length : 0;

      bValue += beginningCheck1.test(b.firstName) ? word1Length + 1 : 0;
      bValue += anyCheck1.test(b.firstName) ? word1Length + 1 : 0;
      bValue += beginningCheck1.test(b.lastName) ? word1Length : 0;
      bValue += anyCheck1.test(b.lastName) ? word1Length : 0;

      if (search[1]) {
        aValue += beginningCheck2.test(a.firstName) ? word2Length : 0;
        aValue += anyCheck2.test(a.firstName) ? word2Length : 0;
        aValue += beginningCheck2.test(a.lastName) ? word2Length : 0;
        aValue += anyCheck2.test(a.lastName) ? word2Length : 0;

        bValue += beginningCheck2.test(b.firstName) ? word2Length : 0;
        bValue += anyCheck2.test(b.firstName) ? word2Length : 0;
        bValue += beginningCheck2.test(b.lastName) ? word2Length : 0;
        bValue += anyCheck2.test(b.lastName) ? word2Length : 0;
      }

      return bValue - aValue;
    });

    normPatients = normalize('patients', patientsSort);

    normPatients.entities.chats = {};
    normPatients.entities.textMessages = {};

    for (let i = 0; i < patientsSort.length; i++) {
      if (patientsSort[i].chats && patientsSort[i].chats.length) {
        const chatNorm = normalize('chats', patientsSort[i].chats);
        normPatients.entities.chats = Object.assign(
          {},
          normPatients.entities.chats,
          chatNorm.entities.chats,
        );
        normPatients.entities.textMessages = Object.assign(
          {},
          normPatients.entities.textMessages,
          chatNorm.entities.textMessages,
        );
      }
    }

    normPatients.entities.patients = normPatients.entities.patients || {};

    return res.send(normPatients);
  } catch (error) {
    next(error);
  }
});

// TODO: this should have default queries and limits
/**
 * Get all patients under a clinic
 */
patientsRouter.get('/', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;
  const { email, patientUserId, limit } = req.query;
  let patients;

  try {
    if (email) {
      patients = await Patient.findAll({
        where: {
          accountId,
          email,
        },
      });

      return res.send({ length: patients.length });
    } else if (patientUserId) {
      patients = await Patient.findAll({
        where: {
          accountId,
          patientUserId,
          status: 'Active',
        },
      });
    } else {
      patients = await Patient.findAll({
        where: { accountId },
        limit,
      });
    }
    return res.send(format(req, res, 'patients', patients.map(p => p.get({ plain: true }))));
  } catch (error) {
    next(error);
  }
});

/**
 * Get suggestions based on query
 */
patientsRouter.get('/suggestions', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;

  const { firstName, lastName, email, mobilePhoneNumber, requestCreatedAt } = req.query;

  let patients;
  try {
    patients = await Patient.findAll({
      where: {
        accountId,
        patientUserId: { $eq: null },
        status: { $ne: 'Inactive' },
        $or: [
          {
            firstName: { ilike: firstName },
            lastName: { ilike: lastName },
          },
          { email },
          { mobilePhoneNumber },
          { homePhoneNumber: mobilePhoneNumber },
          { workPhoneNumber: mobilePhoneNumber },
          { otherPhoneNumber: mobilePhoneNumber },
        ],
      },
      include: [
        {
          model: Appointment,
          as: 'appointments',
          where: {
            startDate: { $gte: new Date(requestCreatedAt) },
            ...Appointment.getCommonSearchAppointmentSchema(),
          },
          order: [['startDate', 'ASC']],
          required: false,
        },
      ],
    });

    const patientsData = patients.map(patient => patient.get({ plain: true }));

    return res.send(normalize('patients', patientsData));
  } catch (error) {
    next(error);
  }
});

patientsRouter.get(
  '/:patientId/nextAppointment',
  checkPermissions('patients:read'),
  async (req, res, next) => {
    const { requestCreatedAt } = req.query;

    try {
      const nextAppt = await Appointment.findAll({
        raw: true,
        where: {
          patientId: req.patient.id,
          startDate: { $gte: new Date(requestCreatedAt) },
          ...Appointment.getCommonSearchAppointmentSchema(),
        },
        order: [['startDate', 'ASC']],
      });
      res.send(normalize('appointments', nextAppt));
    } catch (error) {
      next(error);
    }
  },
);

patientsRouter.post('/emailCheck', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;
  const email = req.body.email.toLowerCase();

  let patient;
  try {
    patient = await Patient.findOne({
      raw: true,
      where: {
        accountId,
        email,
      },
    });
    return res.send({ exists: !!patient });
  } catch (error) {
    next(error);
  }
});

patientsRouter.post(
  '/phoneNumberCheck',
  checkPermissions('patients:read'),
  async ({ accountId, body: { phoneNumber } }, res, next) => {
    const trimmedNumber = phoneNumber.replace(/ +/g, '');
    const cellPhoneNumberFallback = await getCellPhoneNumberFallback(accountId);

    try {
      const patient = await Patient.findOne({
        raw: true,
        where: [{ accountId }, whereCellPhoneNumber(trimmedNumber, cellPhoneNumberFallback)],
      });

      return res.send({ exists: !!patient });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * return changed patients to connector via isSyncedWithPms
 */
patientsRouter.get(
  '/connector/notSynced',
  checkPermissions('patients:read'),
  async (req, res, next) => {
    const { accountId } = req;

    let patients;
    try {
      patients = await Patient.findAll({
        raw: true,
        where: {
          accountId,
          isSyncedWithPms: false,
        },
      });
      return res.send(format(req, res, 'patients', patients));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Fetching events for a patient.
 * params: patientId,
 */

eventsRouter.get(
  '/:patientId/events',
  checkPermissions('patients:read'),
  async (req, res, next) => {
    try {
      const allEvents = await patientEventsAggregator(req.patient.id, req.accountId, req.query);
      res.send(normalize('events', allEvents));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create a patient
 */
patientsRouter.post('/', async (req, res, next) => {
  const accountId = req.accountId || req.body.accountId;
  const patientData = {
    ...req.body,
    accountId,
  };

  try {
    const patientTest = await Patient.build(patientData);
    await patientTest.validate();

    const patient = await Patient.create(patientData);
    if (patient && patient.cellPhoneNumber) {
      const chat = await Chat.findOne({
        where: {
          accountId,
          patientPhoneNumber: patient.cellPhoneNumber,
          patientId: null,
        },
      });

      if (chat) {
        patient.foundChatId = chat.id;
      }
    }
    const normalizedPatient = format(req, res, 'patient', patient.get({ raw: true }));

    res.status(201).send(normalizedPatient);

    return await emitSocketIo(req, patient, [
      {
        key: 'CREATE:Patient',
        value: patient.id,
      },
      {
        key: 'create:Patient',
        value: normalizedPatient,
      },
    ]);
  } catch (e) {
    if (e.errors && e.errors[0] && e.errors[0].message.messages === 'AccountId PMS ID Violation') {
      const patient = e.errors[0].message.model.dataValues;

      const normalizedPatient = format(req, res, 'patient', patient);
      res.status(201).send(normalizedPatient);

      return emitSocketIo(req, patient, [
        {
          key: 'CREATE:Patient',
          value: patient.id,
        },
        {
          key: 'create:Patient',
          value: normalizedPatient,
        },
      ]);
    }
    return next(e);
  }
});

/**
 * Batch create patients for connector
 */
patientsRouter.post(
  '/connector/batch',
  checkPermissions('patients:create'),
  async (req, res, next) => {
    const patients = req.body;
    const cleanedPatients = patients.map(patient =>
      Object.assign({}, patient, {
        accountId: req.accountId,
        isSyncedWithPms: true,
      }));

    return batchCreate(cleanedPatients, Patient, 'Patient')
      .then((savedPatients) => {
        const patientData = savedPatients.map(savedPatient => savedPatient.get({ plain: true }));
        res.status(201).send(format(req, res, 'patients', patientData));
      })
      .catch(({ errors, docs }) => {
        docs = docs.map(d => d.get({ plain: true }));

        // Log any errors that occurred
        errors.forEach((err) => {
          console.error(err);
        });

        const data = format(req, res, 'patients', docs);
        return res.status(201).send(data);
      })
      .catch(next);
  },
);

/**
 * Batch update patients for connector
 */
patientsRouter.put('/connector/batch', checkPermissions('patients:update'), (req, res, next) => {
  const patients = req.body;
  const cleanedPatients = patients.map(patient =>
    Object.assign({}, patient, {
      accountId: req.accountId,
      isSyncedWithPms: true,
    }));

  return batchUpdate(cleanedPatients, Patient, 'Patient', updateChatAfterPatient)
    .then((savedPatients) => {
      const patientData = savedPatients.map(savedPatient => savedPatient.get({ plain: true }));
      res.status(201).send(format(req, res, 'patients', patientData));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'patients', docs);
      return res.status(201).send(data);
    })
    .catch(next);
});

/**
 * Batch creation
 */
patientsRouter.post(
  '/batch',
  checkPermissions('patients:create'),
  checkIsArray('patients'),
  async (req, res, next) => {
    const { patients } = req.body;
    const cleanedPatients = patients.map(patient =>
      Object.assign({}, patient, { accountId: req.accountId }));

    try {
      const savedPatients = await Patient.batchSave(cleanedPatients);
      const savedPatientsResult = savedPatients.map(savedPatient =>
        savedPatient.get({ plain: true }));
      return res.status(201).send(normalize('patients', savedPatientsResult));
    } catch (err) {
      const { errors, docs } = err;
      if (!isArray(errors) || !isArray(docs)) {
        return next(err);
      }

      const successfulPatients = docs.map(d => d.get({ plain: true }));
      const entities = normalize('patients', successfulPatients);
      const responseData = Object.assign({}, entities, { errors });
      return res.status(400).send(responseData);
    }
  },
);

patientsRouter.get(
  '/poc',
  checkPermissions('patients:read'),
  async ({ accountId, query }, res, next) => {
    try {
      const { mobile, email } = query;

      if (!mobile && !email) {
        throw new StatusError(400, 'Mobile or email is required.');
      }

      const poc = await getPatientBasedOnFieldsProvided(accountId, {
        cellPhoneNumber: mobile,
        email,
      });

      if (!poc) {
        throw new StatusError(400, `There is not point of contact for ${mobile || email}.`);
      }

      return res.send(poc);
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * Get a patient
 */
patientsRouter.get('/:patientId', checkPermissions('patients:read'), async (req, res, next) =>
  Promise.resolve(req.patient.get({ plain: true }))
    .then(patient => res.send(format(req, res, 'patient', patient)))
    .catch(next));

/**
 * Update a patient
 */
patientsRouter.put('/:patientId', checkPermissions('patients:read'), async (req, res, next) => {
  try {
    const phoneNumber = req.patient.cellPhoneNumber;
    const patient = await req.patient.update(req.body);
    const normalized = format(req, res, 'patient', patient.dataValues);

    if (patient.cellPhoneNumber && phoneNumber !== patient.cellPhoneNumber) {
      await Chat.update(
        { patientPhoneNumber: patient.cellPhoneNumber },
        {
          where: {
            accountId: req.accountId,
            patientId: patient.id,
          },
        },
      );
    }
    await emitSocketIo(req, patient, [
      {
        key: `${patient.isDeleted ? 'DELETE' : 'UPDATE'}:Patient`,
        value: patient.id,
      },
      {
        key: 'update:Patient',
        value: normalized,
      },
    ]);

    res.status(201).send(normalized);
    return {
      patient,
      normalized,
    };
  } catch (error) {
    next(error);
  }
});

/**
 * Update a patient (connector)
 */
patientsRouter.put('/connector/:patientId', checkPermissions('patients:read'), (req, res, next) => {
  const phoneNumber = req.patient.cellPhoneNumber;
  return req.patient
    .update({
      isSyncedWithPms: true,
      ...req.body,
    })
    .then(async (patient) => {
      if (phoneNumber !== patient.cellPhoneNumber) {
        Chat.findAll({
          where: {
            accountId: req.accountId,
            patientId: patient.id,
          },
        }).then((chat) => {
          if (!chat[0]) {
            return;
          }
          chat[0].update({ patientPhoneNumber: patient.cellPhoneNumber });
        });
      }
      const normalized = format(req, res, 'patient', patient.dataValues);
      res.status(201).send(normalized);
      return {
        patient,
        normalized,
      };
    })
    .then(async ({ patient, normalized }) =>
      emitSocketIo(req, patient, [
        {
          key: `${patient.isDeleted ? 'DELETE' : 'UPDATE'}:Patient`,
          value: patient.id,
        },
        {
          key: 'update:Patient',
          value: normalized,
        },
      ]))
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:patientId', checkPermissions('patients:delete'), (req, res, next) => {
  const { patient } = req;

  return patient
    .destroy()
    .then(() => res.sendStatus(204))
    .then(() => {
      const normalized = format(req, res, 'patient', patient.get({ plain: true }));
      return emitSocketIo(req, patient, [
        {
          key: 'DELETE:Patient',
          value: patient.id,
        },
        {
          key: 'remove:Patient',
          value: normalized,
        },
      ]);
    })
    .catch(next);
});

module.exports = patientsRouter;
