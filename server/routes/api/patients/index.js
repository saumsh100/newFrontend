
const patientsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');
const loaders = require('../../util/loaders');

patientsRouter.param('patientId', loaders('patient', 'Patient'));

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
patientsRouter.post('/', (req, res, next) => {
  const patientData = Object.assign({}, req.body, { accountId: req.accountId || req.body.accountId });

  return Patient.save(patientData)
    .then(patient => res.status(201).send(normalize('patient', patient)))
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
