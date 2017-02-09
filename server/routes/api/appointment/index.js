
const appointmentsRouter = require('express').Router();
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');

appointmentsRouter.get('/', (req, res, next) => {
  return Appointment.filter({

  }).getJoin({
    patient: true,
    practitioner: { services: false },
    service: { practitioners: false },
    chair: true,
  }).run()
    .then(appointments => res.send(normalize('appointments', appointments)))
    .catch(next);
});

appointmentsRouter.get('/:patientId', (req, res, next) => {
  Appointment.filter({
    patientId: req.params.patientId
  }).getJoin({
    patient: true,
    practitioner: {services: false},
    service: {practitioners: false},
    chair: true,
  }).run()
    .then(appointments => res.send(normalize(appointments, arrayOf(appointmentSchema))))
    .catch(next);
});

module.exports = appointmentsRouter;
