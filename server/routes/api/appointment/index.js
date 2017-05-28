
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const loaders = require('../../util/loaders');
const globals = require('../../../config/globals');
const moment = require('moment');

appointmentsRouter.param('appointmentId', loaders('appointment', 'Appointment'));

appointmentsRouter.get('/', (req, res, next) => {
  const {
    accountId,
    joinObject,
    query,
  } = req;


  const {
    limit,
    skip,
  } = query;

  const skipped = skip || 0;
  const limitted = limit || 25;

  let {
    startDate,
    endDate,
  } = query;

  // By default this will list upcoming appointments
  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  return Appointment
    .filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .orderBy('startDate')
    .skip(parseInt(skipped))
    .limit(parseInt(limitted))
    .getJoin(joinObject)
    .run()
    .then((appointments) => {
      res.send(normalize('appointments', appointments));
    })
    .catch(next);
});

appointmentsRouter.post('/', checkPermissions('appointments:create'), (req, res, next) => {
  const accountId = req.accountId;

  const appointmentData = Object.assign({}, req.body, {
    accountId,
  });

  const {
    practitionerId,
    chairId,
    patientId,
  } = req.body;

  const startDate2 = moment(appointmentData.startDate).startOf('day').toISOString();
  const endDate2 = moment(appointmentData.endDate).endOf('day').toISOString();

 console.log(appointmentData,"--------------------------------------------")
  const startDate = r.ISO8601(startDate2);
  const endDate = r.ISO8601(endDate2);

  Appointment.filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .filter({ isDeleted: false })
    .run()
    .then((appointments) => {

    const filteredApps = appointments.filter((app)=>{
      if((moment(appointmentData.startDate).isSame(moment(app.startDate))) ||
      (moment(appointmentData.startDate).isBetween(moment(app.startDate), moment(app.endDate))) ||
        (moment(appointmentData.endDate).isBetween(moment(app.startDate), moment(app.endDate)))) {
         return app;
       };
      });
      return filteredApps.map((app) => {
          if ((practitionerId !== app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            return true;
          } else if ((practitionerId === app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            return true;
          } else {
            return false;
          }
        }
      );
    })
    .then((data) => {
      //console.log(data);
      const testIfOverlap = data.every((el) => el ===true);
      if(data.length === 0 || testIfOverlap) {
        console.log("passed")
        return Appointment.save(appointmentData)
          .then(appt => res.status(201).send(normalize('appointment', appt)))
          .catch(next);
      } else {
        console.log("failed")
        return res.sendStatus(404);
      }
    })
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
 * E.g. api/appointments/test?pmsId=1003&note=unit test appointment
 */
if (globals.env !== 'production') {
  appointmentsRouter.get('/test', checkPermissions('appointments:read'), (req, res, next) => {
    const property = req.query;
    return Appointment
      .filter(property)
      .run()
      .then((appointments) => {
        (appointments.length !== 0) ? res.send(normalize('appointments', appointments)) : res.sendStatus(404);
      })
      .catch(next);
  });
}

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

  const accountId = req.accountId;

  const {
    practitionerId,
    chairId,
    patientId,
  } = req.body;

  const appointmentData = req.body;

  console.log(appointmentData,"--------------------------------------------")
  const startDate = r.ISO8601(appointmentData.startDate);
  const endDate = r.ISO8601(appointmentData.endDate);

  Appointment.filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .filter({ isDeleted: false })
    .run()
    .then((appointments) => {
     console.log(appointments)
      const filterAppointments = appointments.filter((app) => !(app.id === appointmentData.id));
      console.log("------------------",filterAppointments);
      return filterAppointments.map((app) => {
          if ((practitionerId !== app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            return true;
          } else if ((practitionerId === app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            return true;
          } else {
            return false;
          }
        }
      );
    })
    .then((data) => {
      console.log(data);
      const testIfOverlap = data.every((el) => el ===true);
      if(data.length === 0 || testIfOverlap) {
        console.log("passed")
        return req.appointment.merge(req.body).save()
          .then(appointment => res.send(normalize('appointment', appointment)))
          .catch(next);
      } else {
        console.log("failed")
        return res.sendStatus(404);
      }
    })
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
