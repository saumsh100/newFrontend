
const appointmentsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const loaders = require('../../util/loaders');
const Token = require('../../../models/Appointment');


appointmentsRouter.get('/', checkPermissions('appointments:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  return Appointment.filter({ accountId }).getJoin(joinObject).run()
    .then(appointments => res.send(normalize('appointments', appointments)))
    .catch(next);
});

appointmentsRouter.post('/', checkPermissions('appointments:create'), (req, res, next) =>{
  const appointmentData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });
  return Appointment.save(appointmentData)
    .then(appt => res.send(201, normalize('appointment', appt)))
    .catch(next);
});

// TODO: this is not used
/*appointmentsRouter.get('/:patientId', (req, res, next) => {
  const {
    accountId,
    joinObject,
    params: { patientId },
  } = req;

  // TODO: create a loader for patientId and ensure that the user can view this patient
  Appointment.filter({ accountId, patientId }).getJoin(joinObject).run()
    .then(appointments => res.send(normalize('appointment', appointments[0])))
    .catch(next);
});*/


module.exports = appointmentsRouter;
