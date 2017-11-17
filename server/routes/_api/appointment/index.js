
import Moment from 'moment-timezone';
import sequelize from 'sequelize';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import { mostBusinessProcedure } from '../../../lib/intelligence/revenue';
import { newPatients, activePatients } from '../../../lib/intelligence/patients';
import {
  appsHygienist,
  appsNotCancelled,
  appsNewPatient,
  totalAppointments,
  totalAppointmentHoursPractitioner,
  mostAppointments,
} from '../../../lib/intelligence/appointments';
import { practitionersTimeOffs } from '../../../lib/intelligence/practitioner';
import format from '../../util/format';
import batchCreate from '../../util/batch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Account, Service, Patient, Practitioner, WeeklySchedule } from '../../../_models';
import checkIsArray from '../../../middleware/checkIsArray';
import globals, { namespaces } from '../../../config/globals';
import CalcFirstNextLastAppointment from '../../../lib/firstNextLastAppointment';

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
      isCancelled: true,
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
      const hygenApps = await appsHygienist(startDate, endDate, accountId);
      send.hygieneAppts = hygenApps[0] ? Number(hygenApps[0].appsHygienist) : 0;

      const $or = [];

      for (let i = 0; i < appointments.length; i++) {

        if (appointments[i].isCancelled) {
          send.brokenAppts++;

          $or.push({
            accountId,
            isCancelled: false,
            startDate: {
              $between: [appointments[i].startDate,
                appointments[i].endDate],
            },
            endDate: {
              $between: [appointments[i].startDate,
                appointments[i].endDate],
            },
            patientId: {
              $not: null,
            },
            practitionerId: appointments[i].practitionerId,
          });
        }
      }


      const filled = await appsNotCancelled(startDate, endDate, accountId);

      send.brokenAppts = appointments.length - filled;

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


/**
 * get the appointment Booked for a given startDate and endDate in an account
 * @param  startDate
 * @param  endDate
 */
appointmentsRouter.get('/appointmentsBooked', async (req, res, next) => {
  const {
    query,
    accountId,
  } = req;

  const {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  totalAppointments(start, end, accountId);

  try {
    const appointmentsBooked = await totalAppointments(start, end, accountId);
    const confirmedAppointments = await totalAppointments(start, end, accountId, { isPatientConfirmed: true });

    return res.send({ appointmentsBooked, confirmedAppointments });
  } catch (e) {
    return next(e);
  }
});

appointmentsRouter.get('/practitionerWorked', async (req, res, next) => {
  const {
    query,
    accountId,
  } = req;

  const {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  try {
    let activePractitioners = await Practitioner.findAll({
      where: {
        accountId,
        isActive: true,
      },
    });

    activePractitioners = activePractitioners.map(p => p.id);

    const promise1 = practitionersTimeOffs(start, end, accountId);

    const totalAppsPromise = totalAppointmentHoursPractitioner(startDate, endDate, activePractitioners);

    const newPatientsTotalPromise = appsNewPatient(startDate, endDate, accountId, activePractitioners);

    const promise2 = Promise.all([totalAppsPromise, newPatientsTotalPromise])
      .then((values) => {
        const practitioners = {};

        for (let i = 0; i < activePractitioners.length; i += 1) {
          const pracId = activePractitioners[i];

          practitioners[pracId] = {
            booked: 0,
            newPatientsTotal: 0,
          };
        }

        for (let i = 0; i < values[0].length; i += 1) {
          const totalAppointment = values[0][i];

          practitioners[totalAppointment.practitionerId] = {
            booked: totalAppointment.totalAppointmentHours,
            newPatientsTotal: values[1][totalAppointment.practitionerId] || 0,
          };
        }
        return practitioners;
      });

    return Promise.all([promise1, promise2])
      .then((values) => {
        const practitionerWorked = values[0];
        const practitionerStats = values[1];
        const practitioners = [];

        for (let i = 0; i < practitionerWorked.length; i += 1) {
          const prac = practitionerWorked[i];

          let notFilled = prac.hours - prac.timeOffHours;

          if (notFilled > 0) {
            const booked = practitionerStats[prac.id].booked;
            const newPatientsTotal = practitionerStats[prac.id].newPatientsTotal;

            notFilled -= booked;

            if (notFilled < 0) {
              notFilled = 0;
            }

            practitioners.push({
              id: prac.id,
              newPatientsTotal,
              notFilled: Math.round(notFilled),
              booked: Math.round(booked),
              firstName: prac.firstName,
              lastName: prac.lastName,
              avatarUrl: prac.avatarUrl,
              type: prac.type,
            });
          }
        }
        return res.send(practitioners);
      })
      .catch(next);
  } catch (e) {
    return next(e);
  }
});

appointmentsRouter.get('/mostAppointments', async (req, res, next) => {
  const {
    query,
    accountId,
  } = req;

  const {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const start = moment(startDate)._d;
  const end = moment(endDate)._d;

  try {
    let patientAppoointments = await mostAppointments(start, end, accountId);

    patientAppoointments = patientAppoointments.map(p => p.patient);

    return res.send(patientAppoointments);
  } catch (e) {
    return next(e);
  }
});

appointmentsRouter.get('/stats', async (req, res, next) => {
  const {
    query,
    accountId,
  } = req;

  const {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const sendStats = {};

  try {
    const newPatientsNumber = await newPatients(startDate, endDate, accountId);

    sendStats.newPatients = newPatientsNumber[0] ? newPatientsNumber[0].dataValues.newPatients : 0;

    sendStats.activePatients = await activePatients(startDate, endDate, accountId);

    return res.send(sendStats);
  } catch (e) {
    return next(e);
  }
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
    const appointmentTest = await Appointment.build(appointmentData);
    await appointmentTest.validate();

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

          const pub = req.app.get('pub');
          pub.publish('APPOINTMENT:CREATED', appointment.id);

          return io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
        })
        .catch(next);
  } catch (e) {
    if (e.errors[0] && e.errors[0].message.messages === 'AccountId PMS ID Violation') {
      const appointment = e.errors[0].message.model.dataValues;

      const normalized = format(req, res, 'appointment', appointment);
      res.status(201).send(normalized);

      if (appointment.isSyncedWithPms && appointment.patientId) {
        // Dashboard app needs patient data
        const patient = await Patient.findById(appointment.patientId);
        appointment.patient = patient.get({ plain: true });
      }

      const io = req.app.get('socketio');
      const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;
      io.of(ns).in(accountId).emit('CREATE:Appointment', appointment.id);
      return io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
    }
    return next(e);
  }
});

/**
 * Batch create appointments for connector
 */
appointmentsRouter.post('/connector/batch', checkPermissions('appointments:create'), async (req, res, next) => {
  const appointments = req.body;
  const cleanedAppointments = appointments.map(appointment => Object.assign(
    {},
    appointment,
    {
      accountId: req.accountId,
      isSyncedWithPms: true,
    }
  ));

  return batchCreate(cleanedAppointments, Appointment, 'Appointment')
    .then((apps) => {
      const appointmentIds = [];
      const appData = apps.map((app) => {
        const appParsed = app.get({ plain: true })
        appointmentIds.push(appParsed.id);
        return appParsed;
      });

      const pub = req.app.get('pub');
      pub.publish('APPOINTMENT:CREATED:BATCH', JSON.stringify(appointmentIds));

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
 * return changed appointments to connector via isSyncedWithPms
 */
appointmentsRouter.get('/connector/notSynced', checkPermissions('patients:read'), async (req, res, next) => {
  const { accountId } = req;

  let appointments;
  try {
    appointments = await Appointment.findAll({
      raw: true,
      where: {
        accountId,
        isSyncedWithPms: false,
      },
    });
    return res.send(format(req, res, 'appointments', appointments));
  } catch (error) {
    return next(error);
  }
});

/**
 * Batch update appointments for connector
 */
appointmentsRouter.put('/connector/batch', checkPermissions('appointments:update'), (req, res, next) => {
  const appointments = req.body;
  const cleanedAppointments = appointments.map(appointment => Object.assign(
    {},
    appointment,
    {
      accountId: req.accountId,
      isSyncedWithPms: true,
    }
  ));

  const appointmentUpdates = cleanedAppointments.map((appointment) => {
    return Appointment.findById(appointment.id)
      .then(_appointment => _appointment.update(appointment));
  });

  return Promise.all(appointmentUpdates)
    .then((_appointments) => {
      const appointmentIds = [];

      const appData = _appointments.map((app) => {
        const appParsed = app.dataValues;
        appointmentIds.push(appParsed.id);
        return appParsed;
      });
      const pub = req.app.get('pub');
      pub.publish('APPOINTMENT:UPDATED:BATCH', JSON.stringify(appointmentIds));

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
      const appointmentIds = [];

      const appData = apps.map((app) => {
        const appParsed = app.get({ plain: true });
        appointmentIds.push(appParsed.id);
        return appParsed;
      });

      //const pub = req.app.get('pub');
      //pub.publish('APPOINTMENT:CREATED:BATCH', JSON.stringify(appointmentIds));

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
      const appointmentIds = [];

      const appData = _appointments.map((app) => {
        const appParsed = app.get({ plain: true });
        appointmentIds.push(appParsed.id);
        return appParsed;
      });

      //const pub = req.app.get('pub');
      //pub.publish('APPOINTMENT:UPDATED:BATCH', JSON.stringify(appointmentIds));

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

      const pub = req.app.get('pub');
      pub.publish('APPOINTMENT:UPDATED', appointment.id);
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
