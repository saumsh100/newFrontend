
import moment from 'moment';
import _ from 'lodash';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Account, Service, Patient, Practitioner } from '../../../_models';
import checkIsArray from '../../../middleware/checkIsArray';
import globals, { namespaces } from '../../../config/globals';

const appointmentsRouter = Router();

appointmentsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

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
      .filter(r.row.hasFields('patientId'))
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
            .filter(r.row.hasFields('patientId'))
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
    .filter(r.row.hasFields('patientId'))
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
      .filter(r.row.hasFields('patientId'))
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
    .filter(r.row.hasFields('patientId'))
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

      const newObject = {};

      const sorted = Object.keys(sendStats.patients).sort((keyA, keyB) => {
        return sendStats.patients[keyB].numAppointments - sendStats.patients[keyA].numAppointments;
      });

      newObject[sorted[0]] = sendStats.patients[sorted[0]];
      newObject[sorted[1]] = sendStats.patients[sorted[1]];
      newObject[sorted[2]] = sendStats.patients[sorted[2]];
      newObject[sorted[3]] = sendStats.patients[sorted[3]];

      sendStats.patients = newObject;

      sendStats.confirmedAppointments = confirmedAppointments;
      sendStats.notConfirmedAppointments = notConfirmedAppointments;
      res.send(sendStats);
    })
    .catch(next);
});

appointmentsRouter.get('/', (req, res, next) => {
  const {
    accountId,
    includeArray,
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

  startDate = startDate ? startDate : moment().toISOString();
  endDate = endDate ? endDate : moment().add(1, 'years');

  return Appointment.findAll({
    raw: true,
    nested: true,
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    limit: parseInt(limitted),
    include: includeArray,
    offset: parseInt(skipped),
  }).then(appointments => res.send(normalize('appointments', appointments)))
    .catch(next);
});

appointmentsRouter.post('/', checkPermissions('appointments:create'), (req, res, next) => {
  const accountId = req.accountId;
  const appointmentData = Object.assign({}, req.body, {
    accountId,
  });

  return Appointment.create(appointmentData)
    .then((appointment) => {
      const normalized = normalize('appointment', appointment.dataValues);
      res.status(201).send(normalized);
      return { appointment: appointment.dataValues, normalized };
    })
    .then(async ({ appointment }) => {
      // Dispatch to the appropriate socket room
      if (appointment.isSyncedWithPMS && appointment.patientId) {
        appointment.patient = await Patient.findById(appointment.patientId);
      }

      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      return io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
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
    .then(appointment => res.send(normalize('appointment', appointment.dataValues)))
    .catch(next));

/**
 * Update a single appointment
 */
appointmentsRouter.put('/:appointmentId', checkPermissions('appointments:update'), (req, res, next) => {
  const accountId = req.accountId;
  return req.appointment.update(req.body)
    .then((appointment) => {
      const normalized = normalize('appointment', appointment.dataValues);
      res.status(201).send(normalized);
      return { appointment: appointment.dataValues };
    })
    .then(async ({ appointment }) => {
      // Dispatch to the appropriate socket room
      if (appointment.isSyncedWithPMS && appointment.patientId) {
        // Dashboard app needs patient data
        appointment.patient = await Patient.findById(appointment.patientId);
      }

      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      return io.of(ns).in(accountId).emit('update:Appointment', normalize('appointment', appointment));
    })
    .catch(next);
});

/**
 * Remove a single appointment
 */
appointmentsRouter.delete('/:appointmentId', checkPermissions('appointments:delete'), (req, res, next) => {
  const appointment = req.appointment;
  const accountId = req.accountId;
  // TODO: why not use deleteAll ?
  return req.appointment.destroy()
    .then(() => res.send(204))
    .then(() => {
      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPMS ? namespaces.dash : namespaces.sync;
      const normalized = normalize('appointment', appointment);
      return io.of(ns).in(accountId).emit('remove:Appointment', normalized);
    })
    .catch(next);
});

module.exports = appointmentsRouter;
