
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import { mostBusinessProcedure } from '../../../lib/intelligence/revenue';
import format from '../../util/format';
import batchCreate from '../../util/batch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Account, Service, Patient, Practitioner, WeeklySchedule } from '../../../_models';
import checkIsArray from '../../../middleware/checkIsArray';
import globals, { namespaces } from '../../../config/globals';

const moment = extendMoment(Moment);

const appointmentsRouter = Router();

appointmentsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

function getDiffInMin(startDate, endDate) {
  return moment(endDate).diff(moment(startDate), 'minutes');
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const monthsYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

appointmentsRouter.get('/business', (req, res, next) => {
  const {
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


  startDate = startDate || moment().subtract(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  return Appointment.findAll({
    where: {
      accountId,
      $or: [
        {
          startDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
            lt: endDate,
          },
        },
      ],
      patientId: {
        $not: null,
      },
    },
    raw: true,
    nest: true,
    include: [
      {
        model: Practitioner,
        as: 'practitioner',
      },
      {
        model: Patient,
        as: 'patient',
      },
      {
        model: Service,
        as: 'service',
      },
    ],
  })
    .then(async (appointments) => {

      for (let i = 0; i < appointments.length; i++) {
        if (testHygien.test(appointments[i].practitioner.type)) {
          send.hygieneAppts++;
        }

        if (appointments[i].isCancelled) {
          send.brokenAppts++;
          const filled = await Appointment.findOne({
            where: {
              accountId,
              startDate: {
                gte: appointments[i].startDate,
                lte: appointments[i].endDate,
              },
              patientId: {
                $not: null,
              },
              practitionerId: appointments[i].practitionerId,
              isCancelled: false,
            },
          });
          if (filled) {
            send.brokenAppts--;
          }
        }
      }

      send.productionEarnings = await mostBusinessProcedure(startDate, endDate, accountId);

      return res.send(send);
    })
    .catch(next);
});

// data for most popular day of the week.

appointmentsRouter.get('/statsdate', (req, res, next) => {

  const {
    query,
    accountId,
  } = req;
  const startDate = moment().subtract(1, 'years').toISOString();
  const endDate = moment().toISOString();

  const promises = [];

  promises.push(Appointment.findAll({
    where: {
      accountId,
      $or: [
        {
          startDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
            lt: endDate,
          },
        },
      ],
      patientId: {
        $not: null,
      },
    },
    raw: true,
  }));

  promises.push(Account.findOne({
    where: { id: accountId },
    raw: true,
  }));

  return Promise.all(promises)
    .then((results) => {
      const result = results[0];
      const account = results[1];

      const days = new Array(7).fill(0);
      // calculate the frequency of the day of the week
      for (let i = 0; i < result.length; i++) {
        const day = account.timezone ? moment.tz(result[i].startDate, account.timezone).get('day') : moment(result[i].startDate).get('day');
        days[day]++;
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
    Promises.push(Appointment.findAll({
      where: {
        accountId,
        $or: [
          {
            startDate: {
              gt: start,
              lt: end,
            },
          },
          {
            endDate: {
              gt: start,
              lt: end,
            },
          },
        ],
        patientId: {
          $not: null,
        },
      },
      include: [
        {
          model: Patient,
          as: 'patient',
        },
      ],
      raw: true,
      nest: true,
    }));
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

  startDate = startDate || moment().subtract(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  const a = Appointment.findAll({
    where: {
      accountId,
      $or: [
        {
          startDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
            lt: endDate,
          },
        },
      ],
      patientId: {
        $not: null,
      },
    },
    raw: true,
    nest: true,
    include: [
      {
        model: Practitioner,
        as: 'practitioner',
      },
      {
        model: Patient,
        as: 'patient',
      },
      {
        model: Service,
        as: 'service',
      },
    ],
  });

  const b = Practitioner
    .findAll({
      where: {
        accountId,
      },
      raw: true,
    });

  // TODO: this needs to change for practitioner schedule and recurring schedules

  const c = Account.findOne({
    where: {
      id: accountId,
    },
    include: [
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
      },
    ],
    raw: true,
    nest: true,
  });

  const d = Service
    .findAll({
      where: { accountId },
      raw: true,
    });

  const e = Patient
    .findAll({
      where: { accountId },
      limit: 4,
    });

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
      const account = values[2];
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
            if (!sendStats.patients[appointment.patient.id]) {
              sendStats.patients[appointment.patient.id] = {
                numAppointments: 0,
                id: appointment.patient.id,
                firstName: appointment.patient.firstName,
                lastName: appointment.patient.lastName,
                age: moment().diff(moment(appointment.patient.birthDate), 'years'),
                avatarUrl: appointment.patient.avatarUrl,
              };
            }
            sendStats.patients[appointment.patient.id].numAppointments++;
            if (appointment.service && appointment.service.id) {
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
  endDate = endDate ? endDate : moment().add(1, 'years').toISOString();

  return Appointment.findAll({
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
  }).then((appointments) => {
    const sendAppointments = appointments.map(a => a.get({ plain: true }));
    return res.send(format(req, res, 'appointments', sendAppointments));
  })
    .catch(next);
});

appointmentsRouter.post('/', checkPermissions('appointments:create'), async (req, res, next) => {
  const accountId = req.accountId;
  const appointmentData = Object.assign({}, req.body, {
    accountId,
  });

  try {
    if (appointmentData.pmsId) {
      const appointment = await Appointment.findOne({
        where: {
          pmsId: appointmentData.pmsId,
          accountId,
        },
      });
      if (appointment) {
        const normalized = format(req, res, 'appointment', appointment.get({ plain: true }));
        return res.status(200).send(normalized);
      }
    }
  } catch (e) {
    return next(e);
  }

  return Appointment.create(appointmentData)
    .then((appointment) => {
      const normalized = format(req, res, 'appointment', appointment.get({ plain: true }));
      res.status(201).send(normalized);
      return { appointment: appointment.dataValues, normalized };
    })
    .then(async ({ appointment }) => {
      if (appointment.isSyncedWithPms && appointment.patientId) {
        // Dashboard app needs patient data
        const patient = await Patient.findById(appointment.patientId);
        appointment.patient = patient.get({ plain: true });
      }

      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;
      io.of(ns).in(accountId).emit('CREATE:Appointment', appointment.id);
      return io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
    })
    .catch(next);
});

/**
 * Batch create appointments for connector
 */
appointmentsRouter.post('/connector/batch', checkPermissions('appointments:create'), async (req, res, next) => {
  const appointments = req.body;
  const cleanedAppointments = appointments.map(appointment => Object.assign(
    {},
    appointment,
    { accountId: req.accountId }
  ));

  return batchCreate(cleanedAppointments, Appointment, 'Appointment')
    .then((apps) => {
      const appData = apps.map(app => app.get({ plain: true }));
      res.status(201).send(format(req, res, 'appointments', appData));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'appointments', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Batch update appointments for connector
 */
appointmentsRouter.put('/connector/batch', checkPermissions('appointments:update'), (req, res, next) => {
  const appointments = req.body;
  const appointmentUpdates = appointments.map((appointment) => {
    return Appointment.findById(appointment.id)
      .then(_appointment => _appointment.update(appointment));
  });

  return Promise.all(appointmentUpdates)
    .then((_appointments) => {
      const appData = _appointments.map(app => app.get({ plain: true }));
      res.send(format(req, res, 'appointments', appData));
    })
    .catch(next);
});

/**
 * Batch create appointment
 */
appointmentsRouter.post('/batch', checkPermissions('appointments:create'), checkIsArray('appointments'), async (req, res, next) => {
  const { appointments } = req.body;
  const cleanedAppointments = appointments.map((appointment) => Object.assign(
      {},
      _.omit(appointment, ['id']),
      { accountId: req.accountId }
    ));
  return Appointment.batchSave(cleanedAppointments)
    .then((apps) => {
      const appData = apps.map(app => app.get({ plain: true }));
      res.status(201).send(normalize('appointments', appData));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

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
  const appointmentUpdates = appointments.map((appointment) => {
    return Appointment.findById(appointment.id)
      .then(_appointment => _appointment.update(appointment));
  })

  return Promise.all(appointmentUpdates)
    .then((_appointments) => {
      const appData = _appointments.map(app => app.get({ plain: true }));
      res.send(normalize('appointments', appData));
    })
    .catch(next);
});


/**
 * Batch deletion
 */
appointmentsRouter.delete('/batch', checkPermissions('appointments:delete'), (req, res, next) => {
  const appointmentIds = req.query.ids.split(',');

  const appointmentsToDelete = appointmentIds.map((id) => Appointment.findById(id)
      .then(_appointment => _appointment.destroy()));

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
    .then(appointment =>
      res.send(format(req, res, 'appointment', appointment.get({ plain: true }))))
    .catch(next));

/**
 * Update a single appointment
 */
appointmentsRouter.put('/:appointmentId', checkPermissions('appointments:update'), (req, res, next) => {
  const accountId = req.accountId;
  return req.appointment.update(req.body)
    .then((appointment) => {
      const normalized = format(req, res, 'appointment', appointment.get({ plain: true }));
      res.status(201).send(normalized);
      return { appointment: appointment.dataValues };
    })
    .then(async ({ appointment }) => {
      // Dispatch to the appropriate socket room
      if (appointment.isSyncedWithPms && appointment.patientId) {
        // Dashboard app needs patient data
        const patient = await Patient.findById(appointment.patientId);
        appointment.patient = patient.get({ plain: true });
      }

      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;

      // This is assuming we won't get another PUT if isDeleted was already set, or else it's gonna double send a DELETE event
      // We could probably catch this up top and throw a warning/error, DO NOT UPDATE AN APPOINTMENT W/ ISDELETED
      const action = appointment.isDeleted ? 'DELETE' : 'UPDATE';
      io.of(ns).in(accountId).emit(`${action}:Appointment`, appointment.id);

      // TODO: why are we double sending? what was wrong with our current lowercase actions? client-side is easy to update!
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
      const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;
      const normalized = normalize('appointment', appointment.get({ plain: true }));
      io.of(ns).in(accountId).emit('DELETE:Appointment', appointment.id);
      return io.of(ns).in(accountId).emit('remove:Appointment', normalized);
    })
    .catch(next);
});

module.exports = appointmentsRouter;
