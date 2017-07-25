
const _ = require('lodash');
const moment = require('moment');
const patientsRouter = require('express').Router();
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const checkIsArray = require('../../../middleware/checkIsArray');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');
const Chat = require('../../../models/Chat');
const Appointment = require('../../../models/Appointment');
const loaders = require('../../util/loaders');
const { env, namespaces } = require('../../../config/globals');

patientsRouter.param('patientId', loaders('patient', 'Patient'));
patientsRouter.param('joinPatientId', loaders('patient', 'Patient', { appointments: true }));

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

const generateDuringFilter = (m, startDate, endDate) => {
  return m('startDate').during(startDate, endDate).and(m('startDate').ne(endDate)).or(
  m('endDate').during(startDate, endDate).and(m('endDate').ne(startDate))
);
};

patientsRouter.get('/:joinPatientId/stats', checkPermissions('patients:read'), (req, res, next) => {
  const startDate = r.now().add(365 * 24 * 60 * 60 * -1);
  const endDate = r.now();

  return Appointment
      .filter({
        patientId: req.patient.id,
      })
      .filter(r.row('startDate').during(startDate, endDate))
      .then((appointments) => {
        Appointment
          .filter({
            patientId: req.patient.id,
          })
          .filter(r.row('startDate').during(r.time(1970, 1, 1, 'Z'), endDate))
          .orderBy(r.desc('startDate'))
          .then((lastAppointment) => {
            return res.send({
              allApps: req.patient.appointments.length,
              monthsApp: appointments.length,
              lastAppointment: lastAppointment[0] ? lastAppointment[0].startDate : null,
            });
          });
      })
      .catch(next);
});

patientsRouter.get('/stats', checkPermissions('patients:read'), (req, res, next) => {
  const {
    accountId,
  } = req;

  const male = /^male/i;

  const startDate = r.now().add(365 * 24 * 60 * 60 * -1);
  const endDate = r.now();

  return Appointment
    .between([accountId, startDate], [accountId, endDate], { index: 'accountStart' })
    .filter(r.row.hasFields('patientId'))
    .getJoin({
      patient: true,
    })
    .run()
    .then((appointments) => {
      const send = {
        male: 0,
        female: 0,
        ageData: new Array(6).fill(0),
    };

      appointments.map((appointment) => {
        if (appointment.patient.gender && male.test(appointment.patient.gender)) {
          send.male++;
        } else {
          send.female++;
        }
        send.ageData = ageRange(moment().diff(moment(appointment.patient.birthDate), 'years'), send.ageData);
        return 0;
      });
      send.ageData = ageRangePercent(send.ageData);
      res.send(send);
    })
    .catch(next);
});

/**
 * TESTING ONLY
 * Used to search an patient by any property.
 * E.g. api/patients/test?pmsId=1003&note=unit test patient
 */
if (env !== 'production') {
  patientsRouter.get('/test', checkPermissions('patients:read'), (req, res, next) => {
    const property = req.query;
    return Patient
      .filter(property)
      .run()
      .then((patients) => {
        (patients.length !== 0) ? res.send(normalize('patients', patients)) : res.sendStatus(404);
      })
      .catch(next);
  });
}

patientsRouter.get('/search', checkPermissions('patients:read'), (req, res, next) => {
  const searchString = req.query.patients || '';
  const search = searchString.split(' ');


  // making search case insensitive as
  const searchReg = `(?i)${search[0]}`;
  const phoneSearch = `${search[0].replace(/\D/g, '')}`;
  const startDate = r.now();
  const endDate = r.now().add(365 * 24 * 60 * 60);
  Patient
  .getAll(req.accountId, { index: 'accountId' })
  .filter((patient) => {
    if (search[1]) {
      return patient('firstName').match(searchReg).and(patient('lastName').match(`(?i)${search[1]}`))
          .or(patient('firstName').match(`(?i)${search[1]}`).and(patient('lastName').match(searchReg)));
    }
    return patient('firstName').match(searchReg)
        .or(patient('lastName').match(searchReg))
        .or(patient('mobilePhoneNumber').match(phoneSearch))
        .or(patient('homePhoneNumber').match(phoneSearch))
        .or(patient('workPhoneNumber').match(phoneSearch))
        .or(patient('otherPhoneNumber').match(phoneSearch))
        .or(patient('email').match(search[0]));
  }).limit(50)
    .getJoin({ appointments: {
      _apply: (appointment) => {
        return appointment.filter((request) => {
          return generateDuringFilter(request, startDate, endDate);
        });
    } }, chat: {textMessages: { user: true }} })
    .orderBy('firstName')
    .run()
    .then((patients) => {
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

      const normPatients = normalize('patients', patientsSort);

      normPatients.entities.chats = {};
      normPatients.entities.textMessages = {};

      for (let i = 0; i < patientsSort.length; i++) {
        if (patientsSort[i].chat) {
          const chatNorm = normalize('chat', patientsSort[i].chat);
          normPatients.entities.chats = Object.assign(normPatients.entities.chats, chatNorm.entities.chats);
          normPatients.entities.textMessages = Object.assign(normPatients.entities.textMessages, chatNorm.entities.textMessages);
        }
      }
      normPatients.entities.patients = normPatients.entities.patients || {};
      res.send(normPatients);
    })
    .catch(next);
});

// TODO: this should have default queries and limits
/**
 * Get all patients under a clinic
 */
patientsRouter.get('/', checkPermissions('patients:read'), (req, res, next) => {
  const { accountId } = req;
  const { email, patientUserId } = req.query;

  if (email) {
    return Patient.filter({ email }).run()
    .then(p => res.send({ length: p.length }));
  } else if (patientUserId) {
    return Patient
      .filter({ accountId})
      .filter(r.row('patientUserId').eq(patientUserId)).run()
      .then(patient => res.send(normalize('patients', patient)))
  } else {
    return Patient.filter({ accountId }).run()
      .then((patients) => {
        res.send(normalize('patients', patients))
      })
      .catch(next);
  }
});

/**
 * Get suggestions based on query
 */
patientsRouter.get('/suggestions', checkPermissions('patients:read'), (req, res, next) => {
  const { accountId } = req;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
  } = req.query;

  // Todo: This should not be pulling all the patients for the clinic. It needs to use Reql
  // Todo: use https://www.rethinkdb.com/api/javascript/filter/
  Patient
    .filter({ accountId })
    .run()
    .then((patients) => {
      const filteredPatients = patients.filter((patient) => {
        if (!patient.patientUserId && ((patient.firstName === firstName && patient.lastName === lastName) ||
            patient.email === email || patient.phoneNumber === phoneNumber)) {
          return patient;
        }
      });
      res.send(normalize('patients', filteredPatients));
    });

  /**
   * Old Code
   */
  /*
  let subStringPhoneNumber = phoneNumber;
  if (phoneNumber && phoneNumber[0] === '+') {
    subStringPhoneNumber = subStringPhoneNumber.substring(1);
  }

  Patient
    .filter({ accountId })
    .filter((patient) => {
      return patient('accountId').eq(req.accountId).and(
        (patient('firstName').match(firstName)
          .and(patient('lastName').match(lastName)))
          .or(patient('email').match(email))
          .or(patient('phoneNumber').match(subStringPhoneNumber)));
    }).limit(10)
    .run()
    .then((patients) => {
      const filteredPatients = patients.filter((patient) => !patient.patientUserId);
      res.send(normalize('patients', filteredPatients));
    });*/
});

patientsRouter.post('/emailCheck', checkPermissions('patients:read'), (req, res, next) => {
  const { accountId } = req;
  const email = req.body.email.toLowerCase();

  Patient
    .filter({ accountId })
    .filter({ email })
    .run()
    .then((patient) => {
      res.send({ exists: !!patient[0] });
    })
    .catch(next);
});

patientsRouter.post('/phoneNumberCheck', checkPermissions('patients:read'), (req, res, next) => {
  const { accountId } = req;
  const phoneNumber = req.body.phoneNumber;

  const trimmedNumber = phoneNumber.replace(/ +/g, '');

  Patient
    .filter({ accountId })
    .filter(r.row('mobilePhoneNumber').eq(trimmedNumber))
    .run()
    .then((patient) => {
      res.send({ exists: !!patient[0] });
    })
    .catch(next);
});


/**
 * Create a patient
 */
patientsRouter.post('/', (req, res, next) => {
  const accountId = req.accountId || req.body.accountId;
  const patientData = Object.assign({}, req.body, { accountId });
  return Patient.save(patientData)
    .then((patient) => {
      const normalized = normalize('patient', patient);
      res.status(201).send(normalized);
      return { patient, normalized };
    })
    .then(({ patient, normalized }) => {
      // Dispatch to the appropriate socket room
      const io = req.app.get('socketio');
      const ns = patient.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      return io.of(ns).in(accountId).emit('create:Patient', normalized);
    })
    .catch(next);
});

/**
 * Batch creation
 */
patientsRouter.post('/batch', checkPermissions('patients:create'), checkIsArray('patients'), (req, res, next) => {
  const { patients } = req.body;
  console.log('req.accountId', req.accountId);
  const cleanedPatients = patients.map((patient) => {
    return Object.assign(
      {},
      _.omit(patient, ['id']),
      { accountId: req.accountId },
    );
  });

  return Patient.batchSave(cleanedPatients)
    .then(p => res.send(normalize('patients', p)))
    .catch(({ errors, docs }) => {
    // TODO make sure that we are catching the 400 error
      errors = errors.map(({ patient, message }) => {
        // Created At can sometimes be a ReQL query and cannot
        // be stringified by express on res.send, this is a
        // quick fix for now. Also, message has to be plucked off
        // because it is removed on send as well
        delete patient.createdAt;
        return {
          patient,
          message,
        };
      });

      const entities = normalize('patients', docs);
      const responseData = Object.assign({}, entities, { errors });
      return res.status(400).send(responseData);
    })
    .catch(next);
});

/**
 * Get a patient
 */
patientsRouter.get('/:patientId', checkPermissions('patients:read'), (req, res, next) => {
  return Promise.resolve(req.patient)
    .then(patient => res.send(normalize('patient', patient)))
    .catch(next);
});

/**
 * Update a patient
 */
patientsRouter.put('/:patientId', checkPermissions('patients:read'), (req, res, next) => {
  const accountId = req.accountId;

  const phoneNumber = req.patient.mobilePhoneNumber;

  return req.patient.merge(req.body).save()
    .then((patient) => {
      if (phoneNumber !== patient.mobilePhoneNumber) {
        Chat.filter({ accountId: req.accountId })
        .filter({ patientPhoneNumber: phoneNumber })
        .then((chat) => {
          if (!chat[0]) {
            return;
          }
          chat[0].merge({ patientPhoneNumber: patient.mobilePhoneNumber }).save();
        });
      }
      const normalized = normalize('patient', patient);
      res.status(201).send(normalized);
      return { patient, normalized };
    })
    .then(({ patient, normalized }) => {
      // Dispatch to the appropriate socket room
      const io = req.app.get('socketio');
      const ns = patient.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      return io.of(ns).in(accountId).emit('update:Patient', normalized);
    })
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:joinPatientId', checkPermissions('patients:delete'), (req, res, next) => {
  const { patient } = req;
  const accountId = req.accountId;
  return patient.deleteAll()
    .then(() => res.send(204))
    .then(() => {
      const io = req.app.get('socketio');
      const ns = patient.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      const normalized = normalize('patient', patient);
      return io.of(ns).in(accountId).emit('remove:Patient', normalized);
    })
    .catch(next);
});

module.exports = patientsRouter;
