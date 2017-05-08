
const _ = require('lodash');
const patientsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const checkIsArray = require('../../../middleware/checkIsArray');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');
const loaders = require('../../util/loaders');
const globals = require('../../../config/globals');

patientsRouter.param('patientId', loaders('patient', 'Patient'));
patientsRouter.param('joinPatientId', loaders('patient', 'Patient', { appointments: true }));

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

  console.log(req.body);

  const patientData = Object.assign({}, req.body, { accountId: accountId });
  patientData.isSyncedWithPMS = false;
  return Patient.save(patientData)
    .then((patient) => {
      console.log(patient)
      res.status(201).send(normalize('patientSingle', patient));
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
patientsRouter.put('/:patientId', checkPermissions('patients:read'), (req, res, next) => {
  const key = req.body.key || 'patientSingle';
  delete req.body.key;

  // res.send(normalize('patient', patient))
  return req.patient.merge(req.body).save()
    .then(patient => res.send(normalize(key, patient)))
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:patientId', checkPermissions('patients:delete'), (req, res, next) => {
  // TODO: change to joinPatientId

  /*
   return req.patient.deleteAll()
    .then(() => res.send(204))
    .catch(next);

   */

  return Patient.get(req.patient.id).getJoin({ appointments: true }).run()
    .then((patient) => {
      console.log(patient);
      patient.deleteAll();
      res.send(204);
    })
    .catch(next);
});

module.exports = patientsRouter;
