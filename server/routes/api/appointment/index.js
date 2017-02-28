
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');

appointmentsRouter.get('/', checkPermissions('appointments:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
    query,
  } = req;

  const {
    limit = 100,
    skip = 0,
  } = query;

  let {
    startDate,
    endDate,
  } = query;

  // By default this will list upcoming appointments
  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  return Appointment
    .filter({ accountId })
    .filter(r.row('startTime').during(startDate, endDate))
    .orderBy('startTime')
    .skip(parseInt(skip))
    .limit(Math.min(parseInt(limit), 100))
    .getJoin(joinObject)
    .run()
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

/**
 * Batch create appointment
 */
appointmentsRouter.post('/batch', checkPermissions('appointments:create'), checkIsArray('appointments'), (req, res, next) => {
  const { appointments } = req.body;
  const cleanedAppointments = appointments.map((appointment) => {
    return Object.assign(
      {},
      _.omit(appointment, ['id', 'dateCreated']),
      { accountId: req.accountId }
    );
  });
  console.log('creating>>>>>> ', cleanedAppointments);

  return Appointment.save(cleanedAppointments)
    .then(_appointments => res.send(normalize('appointments', _appointments)))
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
