
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const loaders = require('../../util/loaders');

appointmentsRouter.param('appointmentId', loaders('appointment', 'Appointment'));

appointmentsRouter.get('/', (req, res, next) => {
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

  return Appointment.save(cleanedAppointments)
    .then(_appointments => res.send(normalize('appointments', _appointments)))
    .catch(next);
});

/**
 * Batch updating
 */
appointmentsRouter.put('/batch', checkPermissions('appointments:update'), checkIsArray('appointments'), (req, res, next) => {
  const { appointments } = req.body;
  const appointmentUpdates = appointments.map((appointment) => {
    return Appointment.get(appointment.id).run()
      .then(_appointment => _appointment.merge(appointment).save());
  });

  return Promise.all(appointmentUpdates)
    .then(_appointments => res.send(normalize('appointments', _appointments)))
    .catch(next);
});


/**
 * Batch deletion
 */
appointmentsRouter.delete('/batch', checkPermissions('appointments:delete'), (req, res, next) => {
  const appointmentIds = req.query.ids.split(',');

  const appointmentsToDelete = appointmentIds.map((id) => {
    return Appointment.get(id).run()
      .then(_appointment => _appointment.delete());
  });

  return Promise.all(appointmentsToDelete)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

/**
 * TESTING ONLY
 * Used to search an appointment by any property.
 * E.g. api/appointments/test?key=pmsId&value=1003
 */
appointmentsRouter.get('/test', checkPermissions('appointments:read'), (req, res, next) => {
  const keyValue = {};
  keyValue[req.query.key] = req.query.value;
  return Appointment
    .filter(keyValue)
    .run()
    .then(appointment => res.send(normalize('appointments', appointment)))
    .catch(next);
});

/**
 * Get an appointment
 */
appointmentsRouter.get('/:appointmentId', checkPermissions('appointments:read'), (req, res, next) => {
  return Promise.resolve(req.appointment)
    .then(appointment => res.send(normalize('appointment', appointment)))
    .catch(next);
});

/**
 * Update a single appointment
 */
appointmentsRouter.put('/:appointmentId', checkPermissions('appointments:update'), (req, res, next) => {
  return req.appointment.merge(req.body).save()
    .then(appointment => res.send(normalize('appointment', appointment)))
    .catch(next);
});

/**
 * Remove a single appointment
 */
appointmentsRouter.delete('/:appointmentId', checkPermissions('appointments:delete'), (req, res, next) => {
  return req.appointment.delete()
    .then(() => res.send(204))
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
