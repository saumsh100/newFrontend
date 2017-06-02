
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const WeeklySchedule = require('../../../models/WeeklySchedule');
const Practitioner = require('../../../models/Practitioner');
const loaders = require('../../util/loaders');
const globals = require('../../../config/globals');
const moment = require('moment');

appointmentsRouter.param('appointmentId', loaders('appointment', 'Appointment'));

function checkOverLapping(appointments, startDate, endDate) {
  return appointments.filter((app)=>{
    if((moment(startDate).isSame(moment(app.startDate))) ||
      (moment(startDate).isBetween(moment(app.startDate), moment(app.endDate))) ||
      (moment(endDate).isSame(moment(app.endDate))) ||
      (moment(endDate).isBetween(moment(app.startDate), moment(app.endDate)))) {
      return app;
    };
  });
}

function getDiffInMin(startDate, endDate){
  return moment(endDate).diff(moment(startDate), 'minutes');
}

function ageRange(age, array) {
  if (age < 18) {
    array[0]++;
  } else if(age >= 18 && age < 25) {
    array[1]++;
  } else if(age >= 25 && age < 35) {
    array[2]++;
  } else if(age >= 35 && age < 45) {
    array[3]++;
  } else if(age >= 45 && age < 55) {
    array[4]++;
  } else {
    array[5]++;
  }
  return array;
}
function ageRangePercent(array) {
  array[0] = 100 * array[0] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  array[1] = 100 * array[1] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  array[2] = 100 * array[2] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  array[3] = 100 * array[3] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  array[4] = 100 * array[4] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  array[5] = 100 * array[5] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]);
  return array;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/* appointment Stats for intelligece overview */

appointmentsRouter.get('/stats', (req, res, next) => {
  const {
    accountId,
    joinObject,
    query,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  console.log(moment(startDate)._d)

  // By default this will list upcoming appointments

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  const b = Practitioner
    .filter({ accountId })
    //TODO remove getJoin and replace with practionor weekly schedule
    .getJoin({weeklySchedule: true})
    .run();

  const a = Appointment
    .filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .getJoin({
      patient: true,
      practitioner: true,
      service: true,
    })
    .run();



  return Promise.all([a, b])
    .then((values) => {
      const sendStats = {};
      sendStats.practitioner = {};
      sendStats.services = {};
      sendStats.patients = {};
      sendStats.male = 0;
      sendStats.female = 0;
      sendStats.newPatients = 0;
      const male = /^male/i;
      sendStats.ageData = new Array(6).fill(0);
      const range = moment().range(moment(start), moment(end))

      const numberOfDays = moment(end).diff(moment(start), 'days');
      const dayOfWeek = moment(start).day();
      const weeks = Math.floor(numberOfDays/7);
      const remainingDays = numberOfDays % 7;


      values[1].map((practitioner) => {
        const data = {};
        let timeOpen = 0;

        daysOfWeek.map((day) => {
          if (!practitioner.weeklySchedule[day].isClosed) {
            timeOpen += getDiffInMin(practitioner.weeklySchedule[day].startTime, practitioner.weeklySchedule[day].endTime);
            if (practitioner.weeklySchedule[day].breaks) {
              timeOpen -= getDiffInMin(practitioner.weeklySchedule[day].breaks[0].startTime, practitioner.weeklySchedule[day].breaks[0].endTime);
            }
          }
        });

        timeOpen = timeOpen * weeks;

        for (let i = 0; i < remainingDays; i++) {
          if (!practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].isClosed) {
            timeOpen += getDiffInMin(practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].startTime, practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].endTime);
            if (practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].breaks) {
              timeOpen -= getDiffInMin(practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].breaks[0].startTime, practitioner.weeklySchedule[daysOfWeek[i + dayOfWeek]].breaks[0].endTime);
            }
          }
        }

        data.firstName = practitioner.firstName;
        data.lastName = practitioner.lastName;
        data.id = practitioner.id;
        data.totalTime = timeOpen;
        data.appointmentTime = 0;
        data.newPatients = 0;
        sendStats.practitioner[practitioner.id] = data;
      });

      let confirmedAppointments = 0;
      let notConfirmedAppointments = 0;
      let time = 0;

      values[0].map((appointment) => {
        if (range.contains(moment(appointment.patient.createdAt))){
          sendStats.newPatients++;
          sendStats.practitioner[appointment.practitioner.id].newPatients++;
        }
        if (!sendStats.services[appointment.service.id]){
          sendStats.services[appointment.service.id] = {
            time: 0,
            id: appointment.service.id,
            name: appointment.service.name,
          };
        }

        if (!sendStats.patients[appointment.patient.id]){
          sendStats.patients[appointment.patient.id] = {
            numAppointments: 0,
            id: appointment.patient.id,
            firstName: appointment.patient.firstName,
            lastName: appointment.patient.lastName,
            age: moment().diff(moment(appointment.patient.birthDate), 'years'),
            avatarUrl: appointment.patient.avatarUrl,
          };
        }

        time += moment(appointment.endDate).diff(moment(appointment.startDate), 'minutes');
        notConfirmedAppointments++;
        if (appointment.isPatientConfirmed === true && appointment.isCancelled === false) {
          if (male.test(appointment.patient.gender)){
            sendStats.male++;
          } else {
            sendStats.female++;
          }
          sendStats.ageData = ageRange(sendStats.patients[appointment.patient.id].age, sendStats.ageData);
          sendStats.patients[appointment.patient.id].numAppointments++;
          sendStats.services[appointment.service.id].time +=  moment(appointment.endDate).diff(moment(appointment.startDate), 'minutes');
          sendStats.practitioner[appointment.practitioner.id].appointmentTime += moment(appointment.endDate).diff(moment(appointment.startDate), 'minutes');

          confirmedAppointments++;
        }
      });
      sendStats.ageData = ageRangePercent(sendStats.ageData);
      sendStats.confirmedAppointments = confirmedAppointments;
      sendStats.notConfirmedAppointments = notConfirmedAppointments;
      res.send(sendStats);
    })
    .catch(next);
});

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

  const startDate = r.ISO8601(moment(appointmentData.startDate).startOf('day').toISOString());
  const endDate = r.ISO8601(moment(appointmentData.endDate).endOf('day').toISOString());
  Appointment.filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .filter({ isDeleted: false })
    .run()
    .then((appointments) => {
      const filteredApps = checkOverLapping(appointments, appointmentData.startDate, appointmentData.endDate);
      return filteredApps.map((app) => {
        if((practitionerId !== app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
          return true
        } else if ((practitionerId === app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)){
          appointmentData.isSplit = true;
          return true;
        } else {
          return false;
        }
      });
    })
    .then((data) => {
      const testIfNoOverlap = data.every((el) => el ===true);
      if(data.length === 0 || testIfNoOverlap) {
        return Appointment.save(appointmentData)
          .then(appt => res.status(201).send(normalize('appointment', appt)))
          .catch(next);
      } else {
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
  const startDate = r.ISO8601(moment(appointmentData.startDate).startOf('day').toISOString());
  const endDate = r.ISO8601(moment(appointmentData.endDate).endOf('day').toISOString());

  if(appointmentData.isDeleted) {
    return req.appointment.merge(req.body).save()
      .then(appointment => res.send(normalize('appointment', appointment)))
      .catch(next);
  } else {
    Appointment.filter({accountId})
      .filter(r.row('startDate').during(startDate, endDate))
      .filter({isDeleted: false})
      .run()
      .then((appointments) => {
        const filterSameIdApps = appointments.filter((app) => !(app.id === appointmentData.id));
        const filteredApps = checkOverLapping(filterSameIdApps, appointmentData.startDate, appointmentData.endDate);
        if(filteredApps.length === 0 && appointmentData.isSplit) {
          appointmentData.isSplit = false;
        }
        return filteredApps.map((app) => {
          if ((practitionerId !== app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            if (appointmentData.isSplit) {
              appointmentData.isSplit = false;
            }
            return true
          } else if ((practitionerId === app.practitionerId) && (chairId !== app.chairId) && (patientId !== app.patientId)) {
            appointmentData.isSplit = true;
            return true;
          } else {
            return false;
          }
        });
      })
      .then((data) => {
        const testIfNoOverlap = data.every((el) => el === true);
        if (data.length === 0 || testIfNoOverlap) {
          return req.appointment.merge(req.body).save()
            .then(appointment => res.send(normalize('appointment', appointment)))
            .catch(next);
        } else {
          return res.sendStatus(404);
        }
      })
      .catch(next);
  }
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
