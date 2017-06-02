
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const Account = require('../../../models/Account');
const WeeklySchedule = require('../../../models/WeeklySchedule');
const Practitioner = require('../../../models/Practitioner');
const loaders = require('../../util/loaders');
const globals = require('../../../config/globals');
const moment = require('moment');

appointmentsRouter.param('appointmentId', loaders('appointment', 'Appointment'));

function intersectingAppointments(appointments, startDate, endDate) {
  const sDate = moment(startDate);
  const eDate = moment(endDate);
  return appointments.filter((app) => {
    const appStartDate = moment(app.startDate);
    const appEndDate = moment(app.endDate);
    if (sDate.isSame(appStartDate) || sDate.isBetween(appStartDate, appEndDate) ||
      eDate.isSame(appEndDate) || eDate.isBetween(appStartDate, appEndDate)) {
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
  const newArray = array.slice();
  newArray[0] = Math.round(100 * array[0] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[1] = Math.round(100 * array[1] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[2] = Math.round(100 * array[2] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[3] = Math.round(100 * array[3] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[4] = Math.round(100 * array[4] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  newArray[5] = Math.round(100 * array[5] / (array[0] + array[1] + array[2] + array[3] + array[4] + array[5]));
  return newArray;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const monthsYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//data for most popular day of the week.

appointmentsRouter.get('/statsdate', (req, res, next) => {

  const {
    joinObject,
    query,
  } = req;

  let {
    startDate,
    endDate,
    accountId,
  } = query;


  if (!startDate || !endDate) {
    return res.send(400);
  }

  // By default this will list upcoming appointments

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);


  return Appointment
    .filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .run()
    .then((result) => {
      const days = new Array(6).fill(0);
      //calculate the frequency of the day of the week
      for (let i = 0; i < result.length; i++) {
        days[moment(result[i].startDate).get('day') - 1]++;
      }
      res.send({days});
    })
    .catch(next);


});
appointmentsRouter.get('/statslastyear', (req, res, next) => {
  const {
    query,
  } = req;

  const {
    accountId,
  } = query;

  const date = moment(new Date()).subtract(moment(new Date()).get('date') + 1, 'days');

  const Promises = [];
  const months = [];
  let data;

  for (let i = 0; i < 12; i++) {
    const end = moment(date).subtract(i - 1, 'months').toISOString();
    const start = moment(date).subtract(i, 'months').toISOString();
    months.push(monthsYear[moment(date).subtract(i - 1, 'months').get('months')])
    const startDate = r.ISO8601(start);
    const endDate = r.ISO8601(end);
    Promises.push( Appointment
      .filter({ accountId })
      .filter(r.row('startDate').during(startDate, endDate))
      .run());
  }

  Promise.all(Promises)
    .then((values) => {
      data = values.map((value) => {
        return value.length;
      });
      res.send({data: data.reverse(), months : months.reverse()});
    })
    .catch(next);
});

/* appointment Stats for intelligece overview */

appointmentsRouter.get('/stats', (req, res, next) => {
  const {
    joinObject,
    query,
  } = req;

  let {
    startDate,
    endDate,
    accountId,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  // By default this will list upcoming appointments

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);


  const a = Appointment
    .filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .getJoin({
      patient: true,
      practitioner: true,
      service: true,
    })
    .run();

  const b = Practitioner
    .filter({ accountId })
    .run();

  const c = Account
    .filter({ id: accountId })
    .getJoin({weeklySchedule: true})
    .run();

  return Promise.all([a, b, c])
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
      const range = moment().range(moment(start), moment(end));

      const numberOfDays = moment(end).diff(moment(start), 'days');
      const dayOfWeek = moment(start).day();
      const weeks = Math.floor(numberOfDays/7);
      const remainingDays = numberOfDays % 7;

      let timeOpen = 0;

      //Calculate the amount of hours the office is open for a given range
      values[2].map((account) => {
        daysOfWeek.map((day) => {
          if (!account.weeklySchedule[day].isClosed) {
            timeOpen += getDiffInMin(account.weeklySchedule[day].startTime, account.weeklySchedule[day].endTime);
            if (account.weeklySchedule[day].breaks) {
              timeOpen -= getDiffInMin(account.weeklySchedule[day].breaks[0].startTime, account.weeklySchedule[day].breaks[0].endTime);
            }
          }
        });

        timeOpen = timeOpen * weeks;

        for (let i = 0; i < remainingDays; i++) {
          const index = (i + dayOfWeek) % 7;
          if (!account.weeklySchedule[daysOfWeek[index]].isClosed) {
            timeOpen += getDiffInMin(account.weeklySchedule[daysOfWeek[index]].startTime, account.weeklySchedule[daysOfWeek[index]].endTime);
            if (account.weeklySchedule[daysOfWeek[index]].breaks) {
              timeOpen -= getDiffInMin(account.weeklySchedule[daysOfWeek[index]].breaks[0].startTime, account.weeklySchedule[daysOfWeek[index]].breaks[0].endTime);
            }
          }
        }
      });

      //practitioner data
      values[1].map((practitioner) => {
        const data = {};

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
        //create time counter for a service if never used before.
        if (!sendStats.services[appointment.service.id]){
          sendStats.services[appointment.service.id] = {
            time: 0,
            id: appointment.service.id,
            name: appointment.service.name,
          };
        }

        //create patient if never exist for the most seen
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

        let timeApp = moment(appointment.endDate).diff(moment(appointment.startDate), 'minutes');
        timeApp = (timeApp > 0 ? timeApp : 0);

        time += timeApp;
        notConfirmedAppointments++;
        if (appointment.isPatientConfirmed === true && appointment.isCancelled === false) {
          if (male.test(appointment.patient.gender)){
            sendStats.male++;
          } else {
            sendStats.female++;
          }
          sendStats.ageData = ageRange(sendStats.patients[appointment.patient.id].age, sendStats.ageData);
          sendStats.patients[appointment.patient.id].numAppointments++;
          sendStats.services[appointment.service.id].time +=  timeApp;
          sendStats.practitioner[appointment.practitioner.id].appointmentTime += timeApp;

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
  } = appointmentData;

  const startDate = r.ISO8601(moment(appointmentData.startDate).startOf('day').toISOString());
  const endDate = r.ISO8601(moment(appointmentData.endDate).endOf('day').toISOString());

  Appointment.filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate).and(r.row('isDeleted').ne(true)))
    .run()
    .then((appointments) => {
      const intersectingApps = intersectingAppointments(appointments, appointmentData.startDate, appointmentData.endDate);
      const checkOverlapping = intersectingApps.map((app) => {
        if ((practitionerId !== app.practitionerId) &&
          (chairId !== app.chairId) && (patientId !== app.patientId)) {
          return true;
        }
        if ((practitionerId === app.practitionerId) &&
          (chairId !== app.chairId) && (patientId !== app.patientId)){
          appointmentData.isSplit = true;
          return true;
        }
        return false;
      });

      const noOverLap = checkOverlapping.every((el) => el === true);
      if (checkOverlapping.length === 0 || noOverLap) {
        return Appointment.save(appointmentData)
          .then(appt => res.status(201).send(normalize('appointment', appt)))
          .catch(next);
      }
      return res.sendStatus(400);
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

  if (appointmentData.isDeleted) {
    return req.appointment.merge(req.body).save()
      .then(appointment => res.send(normalize('appointment', appointment)))
      .catch(next);
  }

  Appointment.filter({ accountId })
    .filter(r.row('startDate').during(startDate, endDate))
    .filter(r.row('isDeleted').ne(true).and(r.row('id').ne(appointmentData.id)))
    .run()
    .then((appointments) => {
      const intersectingApps = intersectingAppointments(appointments, appointmentData.startDate, appointmentData.endDate);

      if (intersectingApps.length === 0 && appointmentData.isSplit) {
        appointmentData.isSplit = false;
      }

      const checkOverlapping = intersectingApps.map((app) => {
        if ((practitionerId !== app.practitionerId) &&
          (chairId !== app.chairId) && (patientId !== app.patientId)) {
          if (appointmentData.isSplit) {
            appointmentData.isSplit = false;
          }
          return true;

        } else if ((practitionerId === app.practitionerId) &&
          (chairId !== app.chairId) && (patientId !== app.patientId)) {
          appointmentData.isSplit = true;
          return true;
        }

        return false;
      });

      const testIfNoOverlap = checkOverlapping.every((el) => el === true);

      if (checkOverlapping.length === 0 || testIfNoOverlap) {
        return req.appointment.merge(req.body).save()
          .then(appointment => res.send(normalize('appointment', appointment)))
          .catch(next);
      }

      console.log(`This appointment from account: ${accountId}, overlapped with another appointment`);
      return res.sendStatus(400);
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
