
const _ = require('lodash');
const patientsRouter = require('express').Router();
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const checkIsArray = require('../../../middleware/checkIsArray');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');
const loaders = require('../../util/loaders');
const globals = require('../../../config/globals');

patientsRouter.param('patientId', loaders('patient', 'Patient'));
patientsRouter.param('joinPatientId', loaders('patient', 'Patient', { appointments: true }));

const generateDuringFilter = (m, startDate, endDate) => {
  return m('startDate').during(startDate, endDate).and(m('startDate').ne(endDate)).or(
    m('endDate').during(startDate, endDate).and(m('endDate').ne(startDate))
  );
};

/**
 * Batch creation
 */
patientsRouter.post('/batch', checkPermissions('patients:create'), checkIsArray('patients'), (req, res, next) => {
  const { patients } = req.body;
  const cleanedPatients = patients.map((patient) => {
    return Object.assign(
      {},
      _.omit(patient, ['id', 'dateCreated']),
      { accountId: req.accountId }
    );
  });

  return Patient.save(cleanedPatients)
    .then(_patients => res.send(normalize('patients', _patients)))
    .catch(next);
});

/**
 * Batch updating
 */
patientsRouter.put('/batch', checkPermissions('patients:update'), checkIsArray('patients'), (req, res, next) => {
  const { patients } = req.body;
  const patientUpdates = patients.map((patient) => {
    return Patient.get(patient.id).run()
      .then(_patient => _patient.merge(patient).save());
  });

  return Promise.all(patientUpdates)
    .then(_patients => res.send(normalize('patients', _patients)))
    .catch(next);
});

/**
 * TESTING ONLY
 * Used to search an patient by any property.
 * E.g. api/patients/test?pmsId=1003&note=unit test patient
 */
if (globals.env !== 'production') {
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
  const search = searchString.toLowerCase().split(' ');

  search[1] = search[1] || '';

  const startDate = r.now();
  const endDate = r.now().add(365 * 24 * 60 * 60);

  Patient.filter((patient) => {
    return patient('accountId').eq(req.accountId).and(
      patient('firstName').downcase().eq(search[0])
        .or(patient('lastName').downcase().eq(search[0]))
        .or(patient('lastName').downcase().eq(search[1]))
        .or(patient('email').downcase().eq(search[0])));
  }).getJoin({ appointments: {
    _apply: (appointment) => {
      return appointment.filter((request) => {
        return generateDuringFilter(request, startDate, endDate);
      });
    } } })
    .run()
    .then((patients) => {
      console.log(patients)
      const normPatients = normalize('patients', patients);
      normPatients.entities.patients = normPatients.entities.patients || {};
      res.send(normPatients);
    })
    .catch(next);
});

// TODO: this should have default queries and limits
/**
 * Get all patients under a clinic
 */
patientsRouter.get('/', (req, res, next) => {
  const { accountId } = req;
  const { email } = req.query;
  if (email) {
    return Patient.filter({ email }).run()
    .then(p => res.send({ length: p.length }));
  } else {
    return Patient.filter({ accountId }).run()
      .then((patients) => {
        res.send(normalize('patients', patients))
      })
      .catch(next);
  }
});

/**
 * Create a patient
 */
patientsRouter.post('/', (req, res, next) => {
  const accountId = req.accountId || req.body.accountId;

  const patientData = Object.assign({}, req.body, { accountId: accountId });
  patientData.isSyncedWithPMS = false;
  return Patient.save(patientData)
    .then((patient) => {
      res.status(201).send(normalize('patient', patient));
    })
    .catch(next);
});

/**
 * Batch creation
 */
patientsRouter.post('/batch', checkPermissions('patients:create'), checkIsArray('patients'), (req, res, next) => {
  const { patients } = req.body;
  const cleanedPatients = patients.map((patient) => {
    return Object.assign(
      {},
      _.omit(patient, ['id', 'dateCreated']),
      { accountId: req.accountId }
    );
  });

  return Patient.save(cleanedPatients)
    .then(_patients => res.send(normalize('patients', _patients)))
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
patientsRouter.put('/:joinPatientId', checkPermissions('patients:read'), (req, res, next) => {
  return req.patient.merge(req.body).save()
    .then(patient => res.send(normalize('patient', patient)))
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:patientId', checkPermissions('patients:delete'), (req, res, next) => {
   return req.patient.deleteAll()
    .then(() => res.send(204))
    .catch(next);
});

module.exports = patientsRouter;
