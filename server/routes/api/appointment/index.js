
const { normalize, Schema, arrayOf } = require('normalizr');
const appointmentsRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');

const appointmentSchema = new Schema('appointments');

// TODO: this should have default queries and limits
appointmentsRouter.get('/', (req, res, next) => {
  // activeaccount from req.user
  console.log('user', req.user)
  // TODO: ensure that we only pull appointments for activeAccount
  Appointment.run()
    .then(appointments => res.send(normalize(appointments, arrayOf(appointmentSchema))))
    .catch(next);
});

appointmentsRouter.get('/:patientId', (req, res, next) => {
  // todo: implement me
  // const { patientId } = req.params;
  // Appointment.get(patientId)
  //   .then(patient => res.send(normalize(patient, appointmentSchema)))
  //   .catch(next);
});

module.exports = appointmentsRouter;
