/* eslint-disable consistent-return */
import _ from 'lodash';
import { Router } from 'express';
import moment from 'moment';
import format from '../../util/format';
import batchCreate from '../../util/batch';
import { mostBusinessPatient } from '../../../lib/intelligence/revenue';
import checkPermissions from '../../../middleware/checkPermissions';
import checkIsArray from '../../../middleware/checkIsArray';
import normalize from '../normalize';
import { Appointment, Chat, Patient } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';
import { namespaces } from '../../../config/globals';

const patientsRouter = new Router();

patientsRouter.param('patientId', sequelizeLoader('patient', 'Patient'));

function ageRange(age, array) {
  if (age < 18) {
    array[0]++;
  } else if(age >= 18 && age < 25) {
    array[1]++;
  } else if(age >= 25 && age < 35) {
    array[2]++;
  } else if(age >= 35 && age < 45) {
    array[3]++;
  } else if(age >= 45 && age < 55) {
    array[4]++;
  } else {
    array[5]++;
  }
  return array;
}
function ageRangePercent(array) {
  const newArray = array.slice();
  newArray[0] = Math.round(100 * array[0] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[1] = Math.round(100 * array[1] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[2] = Math.round(100 * array[2] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[3] = Math.round(100 * array[3] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[4] = Math.round(100 * array[4] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[5] = Math.round(100 * array[5] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  return newArray;
}

patientsRouter.get('/:patientId/stats', checkPermissions('patients:read'), async (req, res, next) => {
  const startDate = moment().subtract(1, 'years').toISOString();
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
        startDate: {
          $between: [startDate, endDate],
        },
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
          $between: [endDate, moment(endDate).add(100, 'years').toISOString()],
        },
        isDeleted: false,
        isCancelled: false,
      },
      order: [['startDate', 'ASC']],
      limit: 1,
    });

    const mostRecentAppointmentDate = appointmentsAllTimePast[0] ?
      appointmentsAllTimePast[0].startDate : null;

    const totalAppointmentCount = await Appointment.count({
      where: {
        patientId: req.patient.id,
      },
    });

    stats.allApps = totalAppointmentCount;
    stats.monthsApp = appointmentsInDateRangeCount;
    stats.lastAppointment = mostRecentAppointmentDate;
    stats.nextAppointment = appointmentsAllTimeNext[0] ? appointmentsAllTimeNext[0].startDate : null;


    return res.send(stats);
  } catch (error) {
    next(error);
  }
});

patientsRouter.get('/revenueStats', checkPermissions('patients:read'), async (req, res, next) => {
  const {
    accountId,
    query,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  startDate = startDate || moment().subtract(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  return mostBusinessPatient(startDate, endDate, accountId)
          .then(result => res.send(result))
          .catch(next);
});

patientsRouter.get('/stats', checkPermissions('patients:read'), async (req, res, next) => {
  const {
    accountId,
  } = req;

  const male = /^male/i;

  const startDate = moment().subtract(1, 'years').toISOString();
  const endDate = moment().toISOString();

  const stats = {
    male: 0,
    female: 0,
    ageData: new Array(6).fill(0),
  };

  try {
    const appointments = await Appointment.findAll({
      raw: true,
      where: {
        accountId,
        patientId: {
          $ne: null,
        },
        startDate: {
          $between: [startDate, endDate],
        },
      },
      include: [{ association: 'patient' }],
    });

    appointments.map((appointment) => {
      if (appointment['patient.gender'] && male.test(appointment['patient.gender'])) {
        stats.male += 1;
      } else {
        stats.female += 1;
      }

      stats.ageData = ageRange(moment().diff(moment(appointment['patient.birthDate']), 'years'), stats.ageData);
      return 0;
    });
    stats.ageData = ageRangePercent(stats.ageData);

    return res.send(stats);
  } catch (error) {
    next(error);
  }
});


patientsRouter.get('/search', checkPermissions('patients:read'), async (req, res, next) => {
  const searchString = req.query.patients || '';
  const search = searchString.split(' ');

  let normPatients;

  // making search case insensitive as
  const phoneSearch = `%${search[0].replace(/\D/g, '')}`;
  const startDate = moment().toISOString();
  const endDate = moment().add(1, 'years').toISOString();

  let searchClause;
  if (search[1]) {
    searchClause = {
      where: {
        accountId: req.accountId,
        $or: [
          { firstName: { $iLike: `%${search[0]}%` }, lastName: { $iLike: `%${search[1]}%` } },
          { firstName: { $iLike: `%${search[1]}%` }, lastName: { $iLike: `%${search[0]}%` } },
        ],
      },
    };
  } else {
    searchClause = {
      where: {
        accountId: req.accountId,
        $or: [
          { firstName: { $iLike: `%${search[0]}%` } },
          { lastName: { $iLike: `%${search[0]}%` } },
          { email: { $iLike: `%${search[0]}%` } },
        ],
      },
    };
    if (phoneSearch !== '%') {
      searchClause.where.$or.push({ mobilePhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ homePhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ workPhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ otherPhoneNumber: { $like: phoneSearch } });
    }
  }

  try {
    const queryPatients = await Patient.findAll(Object.assign({
      limit: 50,
      order: [['firstName', 'ASC']],
      include: [
        { association: 'appointments', required: false, where: { startDate: { $between: [startDate, endDate] } } },
        {
          association: 'chats',
          required: false,
          include: [{ association: 'textMessages', required: false, include: [{ association: 'user', required: false }] }],
        },
      ],
    }, searchClause));

    const patients = queryPatients.map((queryPatient) => {
      return queryPatient.get({ plain: true });
    });

    const beginningCheck1 = new RegExp(`^${search[0]}`, 'i');
    const beginningCheck2 = search[1] ? new RegExp(`${search[0]}`, 'i') : null;

    const anyCheck1 = new RegExp(search[0], 'i');
    const anyCheck2 = search[1] ? new RegExp(search[0], 'i') : null;

    const word1Length = search[0].length;
    const word2Length = search[1] ? search[1].length : null;

    const patientsSort = patients.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      aValue += (beginningCheck1.test(a.firstName) ? word1Length + 1 : 0);
      aValue += (anyCheck1.test(a.firstName) ? word1Length + 1 : 0);
      aValue += (beginningCheck1.test(a.lastName) ? word1Length : 0);
      aValue += (anyCheck1.test(a.lastName) ? word1Length : 0);

      bValue += (beginningCheck1.test(b.firstName) ? word1Length + 1 : 0);
      bValue += (anyCheck1.test(b.firstName) ? word1Length + 1 : 0);
      bValue += (beginningCheck1.test(b.lastName) ? word1Length : 0);
      bValue += (anyCheck1.test(b.lastName) ? word1Length : 0);

      if (search[1]) {
        aValue += (beginningCheck2.test(a.firstName) ? word2Length : 0);
        aValue += (anyCheck2.test(a.firstName) ? word2Length : 0);
        aValue += (beginningCheck2.test(a.lastName) ? word2Length : 0);
        aValue += (anyCheck2.test(a.lastName) ? word2Length : 0);

        bValue += (beginningCheck2.test(b.firstName) ? word2Length : 0);
        bValue += (anyCheck2.test(b.firstName) ? word2Length : 0);
        bValue += (beginningCheck2.test(b.lastName) ? word2Length : 0);
        bValue += (anyCheck2.test(b.lastName) ? word2Length : 0);
      }

      return bValue - aValue;
    });

    normPatients = normalize('patients', patientsSort);

    normPatients.entities.chats = {};
    normPatients.entities.textMessages = {};

    for (let i = 0; i < patientsSort.length; i++) {
      if (patientsSort[i].chat && patientsSort[i].chat.length) {
        const chatNorm = normalize('chat', patientsSort[i].chat);
        normPatients.entities.chats = Object.assign(normPatients.entities.chats, chatNorm.entities.chats);
        normPatients.entities.textMessages = Object.assign(normPatients.entities.textMessages, chatNorm.entities.textMessages);
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
  const { email, patientUserId } = req.query;
  let patients;

  try {
    if (email) {
      patients = await Patient.findAll({
        raw: true,
        where: { accountId, email },
      });

      return res.send({ length: patients.length });
    } else if (patientUserId) {
      patients = await Patient.findAll({
        raw: true,
        where: { accountId, patientUserId },
      });
    } else {
      patients = await Patient.findAll({
        raw: true,
        where: { accountId },
      });
    }
    return res.send(format(req, res, 'patients', patients));
  } catch (error) {
    next(error);
  }
});

/**
 * Get suggestions based on query
 */
patientsRouter.get('/suggestions', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
  } = req.query;

  let patients;
  try {
    patients = await Patient.findAll({
      raw: true,
      where: {
        accountId,
        patientUserId: { $eq: null },
        $or: [{ firstName, lastName }, { email }, { phoneNumber }],
      },
    });
    return res.send(normalize('patients', patients));
  } catch (error) {
    next(error);
  }
});

patientsRouter.post('/emailCheck', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;
  const email = req.body.email.toLowerCase();

  let patient;
  try {
    patient = await Patient.findOne({
      raw: true,
      where: { accountId, email },
    });
    return res.send({ exists: !!patient });
  } catch (error) {
    next(error);
  }
});

patientsRouter.post('/phoneNumberCheck', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;
  const phoneNumber = req.body.phoneNumber;
  const trimmedNumber = phoneNumber.replace(/ +/g, '');

  let patient;
  try {
    patient = await Patient.findOne({
      raw: true,
      where: { accountId, mobilePhoneNumber: trimmedNumber },
    });
    return res.send({ exists: !!patient });
  } catch (error) {
    next(error);
  }
});


/**
 * Create a patient
 */
patientsRouter.post('/', async (req, res, next) => {
  const accountId = req.accountId || req.body.accountId;
  const patientData = Object.assign({}, req.body, { accountId });

  let patient;
  try {
    patient = await Patient.create(patientData);
    const normalizedPatient = format(req, res, 'patient', patient.get({ plain: true }));
    res.status(201).send(normalizedPatient);

    // Dispatch socket event
    const io = req.app.get('socketio');
    const ns = patient.isSyncedWithPms ? namespaces.dash : namespaces.sync;
    io.of(ns).in(accountId).emit('CREATE:Patient', patient.id);
    return io.of(ns).in(accountId).emit('create:Patient', normalizedPatient);
  } catch (error) {
    next(error);
  }
});

/**
 * Batch create patients for connector
 */
patientsRouter.post('/connector/batch', checkPermissions('patients:create'),
  async (req, res, next) => {
  const patients = req.body;
  const cleanedPatients = patients.map(patient => Object.assign(
    {},
    patient,
    { accountId: req.accountId }
  ));

  return batchCreate(
    cleanedPatients,
    Patient,
    'Patient',
    [Patient.uniqueAgainstEachOther],
    [Patient.uniqueValidate]
  )
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
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Batch creation
 */
patientsRouter.post('/batch', checkPermissions('patients:create'), checkIsArray('patients'), async (req, res, next) => {
  const { patients } = req.body;
  const cleanedPatients = patients.map((patient) => {
    return Object.assign(
      {},
      patient,
      { accountId: req.accountId },
    );
  });

  try {
    const savedPatients = await Patient.batchSave(cleanedPatients);
    const savedPatientsResult = savedPatients.map(savedPatient => savedPatient.get({ plain: true }));
    return res.status(201).send(normalize('patients', savedPatientsResult));
  } catch (err) {
    const { errors, docs } = err;
    if (!_.isArray(errors) || !_.isArray(docs)) {
      return next(err);
    }

    const successfulPatients = docs.map(d => d.get({ plain: true }));
    const entities = normalize('patients', successfulPatients);
    const responseData = Object.assign({}, entities, { errors });
    return res.status(400).send(responseData);
  }
});

/**
 * Get a patient
 */
patientsRouter.get('/:patientId', checkPermissions('patients:read'), async (req, res, next) => {
  return Promise.resolve(req.patient.get({ plain: true }))
    .then(patient => res.send(format(req, res, 'patient', patient)))
    .catch(next);
});

/**
 * Update a patient
 */
patientsRouter.put('/:patientId', checkPermissions('patients:read'), (req, res, next) => {
  const accountId = req.accountId;
  const phoneNumber = req.patient.mobilePhoneNumber;

  return req.patient.update(req.body)
    .then((patient) => {
      if (phoneNumber !== patient.mobilePhoneNumber) {
        Chat.findAll({ where: { accountId: req.accountId, patientPhoneNumber: phoneNumber } })
          .then((chat) => {
            if (!chat[0]) {
              return;
            }
            chat[0].update({ patientPhoneNumber: patient.mobilePhoneNumber });
          });
      }
      const normalized = format(req, res, 'patient', patient.get({ plain: true }));
      res.status(201).send(normalized);
      return { patient, normalized };
    })
    .then(({ patient, normalized }) => {
      // Dispatch to the appropriate socket room
      const io = req.app.get('socketio');
      const ns = patient.isSyncedWithPms ? namespaces.dash : namespaces.sync;

      // This is assuming we won't get another PUT if isDeleted was already set, or else it's gonna double send a DELETE event
      // We could probably catch this up top and throw a warning/error, DO NOT UPDATE AN APPOINTMENT W/ ISDELETED
      const action = patient.isDeleted ? 'DELETE' : 'UPDATE';
      // TODO: should the payload be only an id?
      io.of(ns).in(accountId).emit(`${action}:Patient`, patient.id);

      return io.of(ns).in(accountId).emit('update:Patient', normalized);
    })
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:patientId', checkPermissions('patients:delete'), (req, res, next) => {
  const { patient } = req;
  const accountId = req.accountId;
  return patient.destroy()
    .then(() => res.sendStatus(204))
    .then(() => {
      const io = req.app.get('socketio');
      const ns = patient.isSyncedWithPms ? namespaces.dash : namespaces.sync;
      const normalized = format(req, res, 'patient', patient.get({ plain: true }));
      io.of(ns).in(accountId).emit('DELETE:Patient', patient.id);
      return io.of(ns).in(accountId).emit('remove:Patient', normalized);
    })
    .catch(next);
});

module.exports = patientsRouter;
