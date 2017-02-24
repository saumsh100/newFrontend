
const _ = require('lodash');
const patientsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const checkIsArray = require('../../../middleware/checkIsArray');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');
const loaders = require('../../util/loaders');

patientsRouter.param('patientId', loaders('patient', 'Patient'));

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

// TODO: this should have default queries and limits
/**
 * Get all patients under a clinic
 */
patientsRouter.get('/', checkPermissions('patients:read'), (req, res, next) => {
  const { accountId } = req;
  
  return Patient.filter({ accountId }).run()
    .then(patients => res.send(normalize('patients', patients)))
    .catch(next);
});

/**
 * Create a patient
 */
patientsRouter.post('/', checkPermissions('patients:create'), (req, res, next) => {
  const { firstName, lastName, phoneNumber, email } = req.body;
  const { accountId } = req;
  return Patient.save({
    firstName,
    lastName,
    phoneNumber,
    email,
    accountId,
  }).then(patient => res.status(201).send(normalize('patient', patient)))
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
  return req.patient.merge(req.body).save()
    .then(patient => res.send(normalize('patient', patient)))
    .catch(next);
});

/**
 * Delete a patient
 */
patientsRouter.delete('/:patientId', checkPermissions('patients:delete'), (req, res, next) => {
  return req.patient.delete()
    .then(() => res.send(204))
    .catch(next);
});

module.exports = patientsRouter;
