
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import omit from 'lodash/omit';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import { fetchApptsWithCodes } from '../../../lib/queries/appointments';
import {
  allInsights,
  formatingInsights,
} from '../../../lib/patientInsights/patientInformation';
import format from '../../util/format';
import batchCreate from '../../util/batch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, AppointmentCode, Account, Service, Patient, Practitioner, WeeklySchedule, sequelize } from '../../../_models';
import checkIsArray from '../../../middleware/checkIsArray';
import globals, { namespaces } from '../../../config/globals';

const moment = extendMoment(Moment);
const appointmentsRouter = Router();

appointmentsRouter.param('appointmentId', sequelizeLoader('appointment', 'Appointment'));

appointmentsRouter.get('/insights', async (req, res, next) => {
  const {
    accountId,
    query,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  startDate = startDate || moment().startOf('day').toISOString();
  endDate = endDate || moment().startOf('day').add(1, 'days').toISOString();

  try {
    const insightData = await allInsights(accountId, startDate, endDate);
    return res.send(insightData);
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
    filters = [],
    isParanoid,
  } = query;

  const skipped = skip || 0;
  const limitted = limit || 1000;

  let {
    startDate,
    endDate,
  } = query;

  startDate = startDate || moment().toISOString();
  endDate = endDate || moment().add(1, 'years').toISOString();

  let filterObj = {};
  if (filters && filters.length) {
    filterObj = JSON.parse(filters[0]);
  }

  return Appointment.findAll({
    paranoid: isParanoid !== 'false',
    where: {
      accountId,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
      isMissed: false,
      ...filterObj,
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
  const appointmentData = Object.assign({}, req.body, { accountId });

  try {
    const appointmentTest = await Appointment.build(appointmentData);
    await appointmentTest.validate();

    return Appointment.create(appointmentData)
      .then((appointment) => {
        const normalized = format(req, res, 'appointment', appointment.get({ plain: true }));
        res.status(201).send(normalized);
        return {
          appointment: appointment.dataValues,
          normalized,
        };
      })
      .then(async ({ appointment }) => {
        if (appointment.isSyncedWithPms && appointment.patientId) {
          // Dashboard app needs patient data
          const patient = await Patient.findById(appointment.patientId);
          appointment.patient = patient.get({ plain: true });
        }

        const io = req.app.get('socketio');
        const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;
        io && io.of(ns).in(accountId).emit('CREATE:Appointment', appointment.id);

        const pub = req.app.get('pub');
        pub.publish('APPOINTMENT:CREATED', appointment.id);

        return io && io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
      })
      .catch(next);
  } catch (e) {
    if (e.errors && e.errors[0] && e.errors[0].message.messages === 'AccountId PMS ID Violation') {
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
      io && io.of(ns).in(accountId).emit('CREATE:Appointment', appointment.id);
      return io && io.of(ns).in(accountId).emit('create:Appointment', normalize('appointment', appointment));
    }
    return next(e);
  }
});

/**
 * [createAppointmentCodes function to run after batch create of appointments
 * to create the appointment codes]
 * @param  {[array]} appointments [appointment models]
 * @return {[void]}
 */
async function createAppointmentCodes(appointments) {
  for (let i = 0; i < appointments.length; i += 1) {
    const values = appointments[i].request;

    if (!values.appointmentCodes) continue;

    const createBulk = values.appointmentCodes.map(appCode => ({
      appointmentId: appointments[i].id,
      code: appCode.code,
    }));

    await AppointmentCode.bulkCreate(createBulk);
  }
}

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
    },
  ));

  return batchCreate(cleanedAppointments, Appointment, 'Appointment', [], [], createAppointmentCodes)
    .then(async (apps) => {
      const appointmentIds = apps.map(app => app.id);

      const appsWithCodes = await fetchApptsWithCodes({ id: appointmentIds });

      const appData = appsWithCodes.map(a => a.get({ plain: true }));

      const pub = req.app.get('pub');

      pub && pub.publish('APPOINTMENT:CREATED:BATCH', JSON.stringify(appointmentIds));

      return res.status(201).send(format(req, res, 'appointments', appData));
    })
    .catch(async ({ errors, docs }) => {
      const appointmentIds = docs.map(app => app.id);

      const appsWithCodes = await fetchApptsWithCodes({ id: appointmentIds });

      const appData = appsWithCodes.map(a => a.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'appointments', appData);
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
    appointments = await fetchApptsWithCodes({
      accountId,
      isSyncedWithPms: false,
    });

    const cleanedAppointments = appointments.map(a => a.get({ plain: true }));

    return res.send(format(req, res, 'appointments', cleanedAppointments));
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
    },
  ));

  const appointmentCodes = [];

  cleanedAppointments.forEach((appointment) => {
    if (appointment.appointmentCodes) {
      appointment.appointmentCodes.forEach((ac) => {
        appointmentCodes.push({
          appointmentId: appointment.id,
          code: ac.code,
        });
      });
    }
  });

  const appointmentUpdates = cleanedAppointments.map(appointment => Appointment.findById(appointment.id)
    .then(singleAppointment => singleAppointment.update(appointment)));

  return Promise.all(appointmentUpdates)
    .then(async (singleAppointment) => {
      const t = await sequelize.transaction();
      const appointmentIds = singleAppointment.map(app => app.id);

      try {
        // destroy all codes and recreate them (and any more or less)
        // This is done under a single transaction as if one fails the transaction
        // is undone.
        await AppointmentCode.destroy({
          where: { appointmentId: appointmentIds },
          force: true,
          paranoid: false,
          transaction: t,
        });

        await AppointmentCode.bulkCreate(appointmentCodes, { transaction: t });

        t.commit();
      } catch (e) {
        t.rollback();
        throw e;
      }
      const pub = req.app.get('pub');

      pub && pub.publish('APPOINTMENT:UPDATED:BATCH', JSON.stringify(appointmentIds));

      const appsWithCodes = await fetchApptsWithCodes({ id: appointmentIds });

      const appData = appsWithCodes.map(a => a.get({ plain: true }));

      res.send(format(req, res, 'appointments', appData));
    })
    .catch(next);
});

/**
 * Batch create appointment
 */
appointmentsRouter.post('/batch', checkPermissions('appointments:create'), checkIsArray('appointments'), async (req, res, next) => {
  const { appointments } = req.body;
  const cleanedAppointments = appointments.map(appointment => Object.assign(
    {},
    omit(appointment, ['id']),
    { accountId: req.accountId },
  ));
  return Appointment.batchSave(cleanedAppointments)
    .then((apps) => {
      const appointmentIds = [];

      const appData = apps.map((app) => {
        const appParsed = app.get({ plain: true });
        appointmentIds.push(appParsed.id);
        return appParsed;
      });

      // const pub = req.app.get('pub');
      // pub.publish('APPOINTMENT:CREATED:BATCH', JSON.stringify(appointmentIds));

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
  const appointmentUpdates = appointments.map(appointment => Appointment.findById(appointment.id)
    .then(_appointment => _appointment.update(appointment)));

  return Promise.all(appointmentUpdates)
    .then((_appointments) => {
      const appointmentIds = [];

      const appData = _appointments.map((app) => {
        const appParsed = app.get({ plain: true });
        appointmentIds.push(appParsed.id);
        return appParsed;
      });

      // const pub = req.app.get('pub');
      // pub.publish('APPOINTMENT:UPDATED:BATCH', JSON.stringify(appointmentIds));

      res.send(normalize('appointments', appData));
    })
    .catch(next);
});


/**
 * Batch deletion
 */
appointmentsRouter.delete('/batch', checkPermissions('appointments:delete'), async ({ query: { ids } }, res, next) => {
  try {
    console.log(ids);
    const appointmentsToDelete = ids.split(',').map(id => Appointment.findById(id)
      .then(_appointment => Promise.all([
        _appointment.update({ isDeleted: true }),
        _appointment.destroy(),
      ])));
    await Promise.all(appointmentsToDelete);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
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
      io && io.of(ns).in(accountId).emit(`${action}:Appointment`, appointment.id);

      const pub = req.app.get('pub');
      pub.publish('APPOINTMENT:UPDATED', appointment.id);
      // TODO: why are we double sending? what was wrong with our current lowercase actions? client-side is easy to update!
      return io && io.of(ns).in(accountId).emit('update:Appointment', normalize('appointment', appointment));
    })
    .catch(next);
});

/**
 * Remove a single appointment
 */
appointmentsRouter.delete('/:appointmentId', checkPermissions('appointments:delete'), async ({ app, accountId, appointment }, res, next) => {
  try {
    await Promise.all([
      appointment.update({ isDeleted: true }),
      appointment.destroy(),
    ]);
    res.sendStatus(204);

    const io = app.get('socketio');
    const ns = appointment.isSyncedWithPms ? namespaces.dash : namespaces.sync;
    const normalized = normalize('appointment', appointment.get({ plain: true }));
    io && io.of(ns).in(accountId).emit('DELETE:Appointment', appointment.id);
    return io && io.of(ns).in(accountId).emit('remove:Appointment', normalized);
  } catch (e) {
    next(e);
  }
});

module.exports = appointmentsRouter;
