
const { normalize, Schema, arrayOf } = require('normalizr');
const patientsRouter = require('express').Router();
const Patient = require('../../../models/Patient');

const patientSchema = new Schema('patients');

/*patientsRouter.param('patientId', (req, res, next, patientId) => {
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});*/

// TODO: this should have default queries and limits
patientsRouter.get('/', (req, res, next) => {
  // TODO: ensure that we only pull patients for activeAccount
  Patient.run()
    .then(patients => res.send(normalize(patients, arrayOf(patientSchema))))
    .catch(next);
});

patientsRouter.get('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  Patient.get(patientId)
    .then(patient => res.send(normalize(patient, patientSchema)))
    .catch(next);
});

module.exports = patientsRouter;
