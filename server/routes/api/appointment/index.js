
const { normalize, Schema, arrayOf } = require('normalizr');
const appointmentsRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');

const appointmentSchema = new Schema('appointments');

appointmentsRouter.get('/', (req, res, next) => {
  console.log('user', req.user)
  Appointment.filter({
    accountId: req.user.data.activeAccountId
  }).run()
    .then(appointments => res.send(normalize(appointments, arrayOf(appointmentSchema))))
    .catch(next);
});

appointmentsRouter.get('/:patientId', (req, res, next) => {
  Appointment.filter({
    patientId: req.params.patientId
  }).run()
    .then(appointments => res.send(normalize(appointments, arrayOf(appointmentSchema))))
    .catch(next);
});

module.exports = appointmentsRouter;
