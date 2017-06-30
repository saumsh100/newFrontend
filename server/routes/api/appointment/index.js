
const _ = require('lodash');
const appointmentsRouter = require('express').Router();
const checkIsArray = require('../../../middleware/checkIsArray');
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Appointment = require('../../../models/Appointment');
const { namespaces } = require('../../../config/globals');
const Account = require('../../../models/Account');
const Service = require('../../../models/Service');
const Patient = require('../../../models/Patient');
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


function getDiffInMin(startDate, endDate) {
  return moment(endDate).diff(moment(startDate), 'minutes');
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const monthsYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

appointmentsRouter.get('/business', (req, res, next) => {

  const {
    joinObject,
    query,
    accountId,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const send = {
    hygieneAppts: 0,
    brokenAppts: 0,
  };

  const testHygien = /hygien/i;

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  function addtoFilter(rowTest, startTime, endTime, practitionerId) {
    if (!rowTest) {
      return r.row('startDate').during(startTime, endTime).and(r.row('practitionerId').eq(practitionerId));
    }
    return rowTest.or(r.row('startDate').during(startTime, endTime).and(r.row('practitionerId').eq(practitionerId)));
  }

  Appointment
      .between([accountId, startDate], [accountId, endDate], { index: 'accountStart' })
      .getJoin({
        patient: true,
        practitioner: true,
        service: true,
      })
      .run()
      .then((appointments) => {
        let filter = null;

        appointments.map((appointment) => {
          if (testHygien.test(appointment.practitioner.type)) {
            send.hygieneAppts++;
          }
          if (appointment.isCancelled) {
            send.brokenAppts++;
            // add filter to for query to find out if a cancelled appointment has been refilled
            filter = addtoFilter(filter, r.ISO8601(moment(appointment.startDate).toISOString()), r.ISO8601(moment(appointment.endDate).toISOString()), appointment.practitionerId);
          }
          return null;
        });
        Appointment
            .filter({ accountId })
            .filter(filter)
            .run()
            .then((appointments) => {
              appointments.map((appointment) => {
                if (!appointment.isCancelled) {
                  send.brokenAppts--;
                }
                return null;
              });
              res.send(send);
            });
      })
      .catch(next);
});

// data for most popular day of the week.

appointmentsRouter.get('/statsdate', (req, res, next) => {

  const {
    query,
    accountId,
  } = req;

  const startDate = r.now().add(365 * 24 * 60 * 60 * -1);
  const endDate = r.now();

  return Appointment
    .between([accountId, startDate], [accountId, endDate], { index: 'accountStart' })
    .run()
    .then((result) => {
      const days = new Array(6).fill(0);
      // calculate the frequency of the day of the week
      for (let i = 0; i < result.length; i++) {
        days[moment(result[i].startDate).get('day') - 1]++;
      }
      res.send({ days });
    })
    .catch(next);
});

appointmentsRouter.get('/statslastyear', (req, res, next) => {
  const {
    query,
    accountId,
  } = req;


  const date = moment(new Date()).subtract(moment(new Date()).get('date') + 1, 'days');
  const age = new Array(6).fill(0);

  const Promises = [];
  const months = [];
  let data;

  for (let i = 0; i < 12; i++) {
    const end = moment(date).subtract(i - 1, 'months').toISOString();
    const start = moment(date).subtract(i, 'months').toISOString();
    months.push(monthsYear[moment(date).subtract(i - 1, 'months').get('months')]);
    const startDate = r.ISO8601(start);
    const endDate = r.ISO8601(end);
    Promises.push(Appointment
      .between([accountId, startDate], [accountId, endDate], { index: 'accountStart' })
      .getJoin({
        patient: true,
      })
      .run());
  }

  Promise.all(Promises)
    .then((values) => {
      data = values.map((value) => {
        value.map((appointment) => {
          const patientAge = moment().diff(moment(appointment.patient.birthDate), 'years');
          if (patientAge < 18) {
            age[0]++;
          }
          if (patientAge > 18 && patientAge < 25) {
            age[1]++;
          }
          if (patientAge > 24 && patientAge < 35) {
            age[2]++;
          }
          if (patientAge > 34 && patientAge < 45) {
            age[3]++;
          }
          if (patientAge > 44 && patientAge < 55) {
            age[4]++;
          }
          if (patientAge > 54) {
            age[5]++;
          }
        });
        return value.length;
      });
      res.send({ data: data.reverse(), months: months.reverse(), age });
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

  accountId = accountId || req.accountId;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  // By default this will list upcoming appointments

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  const a = Appointment
    .between([accountId, startDate], [accountId, endDate], { index: 'accountStart' })
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
    .getJoin({ weeklySchedule: true })
    .run();

  const d = Service
    .filter({ accountId })
    .run();

  const e = Patient
    .filter({ accountId })
    .run();

  return Promise.all([a, b, c, d, e])
    .then((values) => {
      const sendStats = {};
      sendStats.practitioner = {};
      sendStats.services = {};
      sendStats.patients = {};
      sendStats.newPatients = 0;
      const range = moment().range(moment(start), moment(end));

      const numberOfDays = moment(end).diff(moment(start), 'days');
      const dayOfWeek = moment(start).day();
      const weeks = Math.floor(numberOfDays / 7);
      const remainingDays = numberOfDays % 7;

      let timeOpen = 0;

      values[3].map((service) => {
        // create time counter for a service
        sendStats.services[service.id] = {
          time: 0,
          id: service.id,
          name: service.name,
        };
      });

      values[4].map((patient) => {
        // create patients
        if (!sendStats.patients[patient.id]) {
          sendStats.patients[patient.id] = {
            numAppointments: 0,
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            age: moment().diff(moment(patient.birthDate), 'years'),
            avatarUrl: patient.avatarUrl,
          };
        }
      });

      // Calculate the amount of hours the office is open for a given range
      values[2].map((account) => {
        daysOfWeek.map((day) => {
          if (!account.weeklySchedule[day].isClosed) {
            timeOpen += getDiffInMin(account.weeklySchedule[day].startTime, account.weeklySchedule[day].endTime);
            if (account.weeklySchedule[day].breaks && account.weeklySchedule[day].breaks[0]) {
              timeOpen -= getDiffInMin(account.weeklySchedule[day].breaks[0].startTime, account.weeklySchedule[day].breaks[0].endTime);
            }
          }
        });

        timeOpen *= weeks;

        for (let i = 0; i < remainingDays; i++) {
          const index = (i + dayOfWeek) % 7;
          if (!account.weeklySchedule[daysOfWeek[index]].isClosed) {
            timeOpen += getDiffInMin(account.weeklySchedule[daysOfWeek[index]].startTime, account.weeklySchedule[daysOfWeek[index]].endTime);
            if (account.weeklySchedule[daysOfWeek[index]].breaks && account.weeklySchedule[daysOfWeek[index]].breaks[0]) {
              timeOpen -= getDiffInMin(account.weeklySchedule[daysOfWeek[index]].breaks[0].startTime, account.weeklySchedule[daysOfWeek[index]].breaks[0].endTime);
            }
          }
        }
      });

      // practitioner data
      values[1].map((practitioner) => {
        if (practitioner.isActive) {
          const data = {};

          data.firstName = practitioner.firstName;
          data.lastName = practitioner.lastName;
          data.id = practitioner.id;
          data.totalTime = timeOpen;
          data.type = practitioner.type;
          data.appointmentTime = 0;
          data.newPatients = 0;
          data.avatarUrl = practitioner.avatarUrl,
          data.fullAvatarUrl = practitioner.fullAvatarUrl,
          sendStats.practitioner[practitioner.id] = data;
        }
      });

      let confirmedAppointments = 0;
      let notConfirmedAppointments = 0;
      let time = 0;

      values[0].map((appointment) => {
        if (appointment.practitioner.isActive) {
          if (range.contains(moment(appointment.patient.createdAt))) {
            sendStats.newPatients++;
            sendStats.practitioner[appointment.practitioner.id].newPatients++;
          }

          let timeApp = moment(appointment.endDate).diff(moment(appointment.startDate), 'minutes');
          timeApp = (timeApp > 0 ? timeApp : 0);

          time += timeApp;
          notConfirmedAppointments++;

          if (appointment.isPatientConfirmed === true && appointment.isCancelled === false) {
            sendStats.patients[appointment.patient.id].numAppointments++;
            if (appointment.service) {
              sendStats.services[appointment.service.id].time += timeApp;
            }
            sendStats.practitioner[appointment.practitioner.id].appointmentTime += timeApp;

            confirmedAppointments++;
          }
        }
      });


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

  // const {
  //   practitionerId,
  //   patientId,
  // } = appointmentData;
  //
  // const startDate = r.ISO8601(moment(appointmentData.startDate).startOf('day').toISOString());
  // const endDate = r.ISO8601(moment(appointmentData.endDate).endOf('day').toISOString());
  //
  // Appointment.filter({ accountId })
  //   .filter(r.row('startDate').during(startDate, endDate).and(r.row('isDeleted').ne(true)).and(r.row('isCancelled').ne(true)))
  //   .getJoin({ service: true })
  //   .run()
  //   .then((appointments) => {
  //     const appWithService = appointments.filter(appService => appService.service);
  //
  //     const intersectingApps = intersectingAppointments(appWithService, appointmentData.startDate, appointmentData.endDate);
  //
  //     const checkOverlapping = intersectingApps.filter((app) => {
  //       if ((practitionerId !== app.practitionerId) && (patientId !== app.patientId)) {
  //         return app;
  //       }
  //
  //       if ((practitionerId === app.practitionerId) && (patientId !== app.patientId)) {
  //         return app;
  //       }
  //     });
  //
  //     if (intersectingApps.length === 0 || checkOverlapping.length > 0) {
  //       return Appointment.save(appointmentData)
  //         .then((appt) => {
  //           res.status(201).send(normalize('appointment', appt));
  //         })
  //         .catch(next);
  //     }
  //     console.log(`This appointment from account: ${accountId}, overlapped with another appointment`);
  //     return res.sendStatus(400);
  //   })
  //   .catch(next);
  return Appointment.save(appointmentData)
    .then(appointment => {
      res.status(201).send(normalize('appointment', appointment))
    })
    .catch(next);
});

/**
 * Batch create appointment
 */
appointmentsRouter.post('/batch', checkPermissions('appointments:create'), checkIsArray('appointments'), (req, res, next) => {
  const { appointments } = req.body;
  const cleanedAppointments = appointments.map((appointment) => Object.assign(
      {},
      _.omit(appointment, ['id']),
      { accountId: req.accountId }
    ));

  return Appointment.batchSave(cleanedAppointments)
    .then(a => res.send(normalize('appointments', a)))
    .catch(({ errors, docs }) => {
      errors = errors.map(({ appointment, message }) => {
        // Created At can sometimes be a ReQL query and cannot
        // be stringified by express on res.send, this is a
        // quick fix for now. Also, message has to be plucked off
        // because it is removed on send as well
        delete appointment.createdAt;
        return {
          appointment,
          message,
        };
      });

      const entities = normalize('appointments', docs);
      const responseData = Object.assign({}, entities, { errors });
      return res.status(400).send(responseData);
    })
    .catch(next);
});

/**
 * Batch updating
 */
appointmentsRouter.put('/batch', checkPermissions('appointments:update'), checkIsArray('appointments'), (req, res, next) => {
  const { appointments } = req.body;
  const appointmentUpdates = appointments.map((appointment) => Appointment.get(appointment.id).run()
      .then(_appointment => _appointment.merge(appointment).save()));

  return Promise.all(appointmentUpdates)
    .then(_appointments => res.send(normalize('appointments', _appointments)))
    .catch(next);
});


/**
 * Batch deletion
 */
appointmentsRouter.delete('/batch', checkPermissions('appointments:delete'), (req, res, next) => {
  const appointmentIds = req.query.ids.split(',');

  const appointmentsToDelete = appointmentIds.map((id) => Appointment.get(id).run()
      .then(_appointment => _appointment.delete()));

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
appointmentsRouter.get('/:appointmentId', checkPermissions('appointments:read'), (req, res, next) => Promise.resolve(req.appointment)
    .then(appointment => res.send(normalize('appointment', appointment)))
    .catch(next));

/**
 * Update a single appointment
 */
appointmentsRouter.put('/:appointmentId', checkPermissions('appointments:update'), (req, res, next) => {
  // const accountId = req.accountId;

  // const {
  //   practitionerId,
  //   patientId,
  // } = req.body;
  //
  // const appointmentData = req.body;
  // const startDate = r.ISO8601(moment(appointmentData.startDate).startOf('day').toISOString());
  // const endDate = r.ISO8601(moment(appointmentData.endDate).endOf('day').toISOString());
  //
  // if (appointmentData.isDeleted) {
  //   return req.appointment.merge(req.body).save()
  //     .then(appointment => res.send(normalize('appointment', appointment)))
  //     .catch(next);
  // }
  //
  // Appointment.filter({ accountId })
  //   .filter(r.row('startDate').during(startDate, endDate))
  //   .filter(r.row('isDeleted').ne(true).and(r.row('id').ne(appointmentData.id)).and(r.row('isCancelled').ne(true)))
  //   .getJoin({ service: true })
  //   .run()
  //   .then((appointments) => {
  //     const appWithService = appointments.filter(appService => appService.service);
  //
  //     const intersectingApps = intersectingAppointments(appWithService, appointmentData.startDate, appointmentData.endDate);
  //
  //     const checkOverlapping = intersectingApps.filter((app) => {
  //       if ((practitionerId !== app.practitionerId) && (patientId !== app.patientId)) {
  //         return app;
  //       }
  //       if ((practitionerId === app.practitionerId) && (patientId !== app.patientId)) {
  //         return app;
  //       }
  //     });
  //
  //     if (intersectingApps.length === 0 || checkOverlapping.length > 0) {
  //       return req.appointment.merge(req.body).save()
  //         .then(appointment => res.send(normalize('appointment', appointment)))
  //         .catch(next);
  //     }
  //
  //     console.log(`This appointment from account: ${accountId}, overlapped with another appointment`);
  //     return res.sendStatus(400);
  //   })
  //   .catch(next);

  return req.appointment.merge(req.body).save()
    .then(appointment => res.send(normalize('appointment', appointment)))
    .catch(next);
});

/**
 * Remove a single appointment
 */
appointmentsRouter.delete('/:appointmentId', checkPermissions('appointments:delete'), (req, res, next) => req.appointment.delete()
    .then(() => res.send(204))
    .catch(next));

// TODO: this is not used
/* appointmentsRouter.get('/:patientId', (req, res, next) => {
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
