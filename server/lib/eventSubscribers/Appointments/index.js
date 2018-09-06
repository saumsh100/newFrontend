
import moment from 'moment';
import { Account, Appointment, Patient } from '../../../_models';
import { calcFirstNextLastAppointment } from '../../../lib/firstNextLastAppointment';
import updateLastProcedureForAccount from '../../../lib/lastProcedure/updateLastProcedureForAccount';
import { getConfigsForLastProcedure } from '../../../lib/lastProcedure/runLastProcedureCronForAccounts';
import lastProcedureData from '../../../lib/lastProcedure/lastProcedureData';
import { getConfigsForDueDates, updatePatientDueDatesForAccount } from '../../../lib/dueDate';

/**
 * does the firstNextLast calculation by grabbing all the patients appointments
 */
function calcPatientFNLAllApps(app) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId: app.accountId,
      patientId: app.patientId,
      isCancelled: false,
      isDeleted: false,
      isMissed: false,
      isPending: false,
    },
    order: [['startDate', 'DESC']],
  }).then(async (appointments) => {
    return await calcFirstNextLastAppointment(appointments,
      async (currentPatient, appointmentsObj) => {
        try {
          await Patient.update({
            ...appointmentsObj,
          },
            {
              where: {
                id: currentPatient,
              },
            });
        } catch (err) {
          console.log(err);
        }
      });
  });
};

/**
 * does the firstNextLast calculation without grabbing all the patients appointments
 * unless necessary.
 *
 */

function calcPatientFNLSingleApp(app, patient, startDate) {
  if (moment(startDate).isAfter(new Date()) && !patient.nextApptId) {
    patient.nextApptId = app.id;
    patient.nextApptDate = startDate;

    return Patient.update(patient, {
      where: {
        id: patient.id,
      },
    });
  } else if (moment(startDate).isAfter(new Date()) && patient.nextApptId){
    return Appointment.findOne({
      where: { id: patient.nextApptId },
      raw: true,
    }).then((appNext) => {
      if (moment(appNext.startDate).isAfter(moment(startDate))) {
        patient.nextApptId = app.id;
        patient.nextApptDate = startDate;

        return Patient.update(patient, {
          where: {
            id: patient.id,
          },
        });
      }
    });
  } else if (moment(startDate).isBefore(new Date()) && !patient.lastApptId && !patient.firstApptId) {
    patient.lastApptId = app.id;
    patient.lastApptDate = startDate;

    patient.firstApptId = app.id;
    patient.firstApptDate = startDate;

    return Patient.update(patient, {
      where: {
        id: patient.id,
      },
    });
  }

  return calcPatientFNLAllApps(app);
}

/**
 * does the firstNextLast calculation for a single appointment
 *
 * @param  {id} - id of an appointment
 */

function firstNextLastAppointmentCalc(id) {
  return Appointment.findOne({
    where: { id },
    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
      },
    ],
    nest: true,
    raw: true,
  }).then((app) => {
    if (app) {
      const patient = app.patient;
      const startDate = app.startDate;

      if (!app.isDeleted && !app.isPending && !app.isMissed && !app.isCancelled) {
        return calcPatientFNLSingleApp(app, patient, startDate);
      }

      // If an appointment was cancelled deleted or changed to pending reset FNL for this patient.
      return calcPatientFNLAllApps(app);
    }
  });
}

/**
 * does the firstNextLast calculation of a batch of appointments from the connector
 *
 * @param  {[appointmentIds]} - array of appointment ids that were created/updated
 */
function firstNextLastAppointmentBatchCalc(appointmentIds) {
  return Appointment.findAll({
    raw: true,
    where: {
      id: appointmentIds,
      isCancelled: false,
      isDeleted: false,
      isMissed: false,
      isPending: false,
      patientId: {
        $not: null,
      },
    },
    order: [['patientId', 'DESC'], ['startDate', 'DESC']],
  }).then(async (appointments) => {
    console.log('Batching First Next Last');
    return await calcFirstNextLastAppointment(appointments,
      async (currentPatient, appointmentsObj) => {
        try {
          await Patient.update({
            ...appointmentsObj,
          },
            {
              where: {
                id: currentPatient,
              },
            });
        } catch (err) {
          console.log(err);
        }
      });
  });
}

 /**
 * does the due date calculation when a appointment(s)
 * is changed and the other jobs it needs (last recall and last hygiene)
 *
 * @param  {[array]} - array of appointment ids that got updated
 */
async function dueDateCalculation(ids) {
  const appointments = await Appointment.findAll({
    raw: true,
    group: ['patientId', 'accountId'],
    paranoid: false,
    attributes: ['patientId', 'accountId'],
    where: {
      id: ids,
      patientId: {
        $not: null,
      },
    },
  });

  if (appointments.length) {
    const patientIds = appointments.map(p => p.patientId);
    const accountId = appointments[0].accountId;
    const account = await Account.findById(accountId);
    const lastHygieneConfigs = await getConfigsForLastProcedure({ account, ...lastProcedureData['lastHygiene'] });
    const lastRecallConfigs = await getConfigsForLastProcedure({ account, ...lastProcedureData['lastRecall'] });
    await updateLastProcedureForAccount({
      account,
      patientIds,
      ...lastHygieneConfigs,
      ...lastProcedureData['lastHygiene'],
    });

    await updateLastProcedureForAccount({
      account,
      patientIds,
      ...lastRecallConfigs,
      ...lastProcedureData['lastRecall'],
    });

    // Fetch account and other configurations that are important for the dueDates job
    const configurationsMap = await getConfigsForDueDates(account);
    const date = (new Date()).toISOString();
    await updatePatientDueDatesForAccount({ account, date, patientIds, ...configurationsMap });
  }
}

function registerAppointmentCalc(sub, push) {
  sub.on('data', async (data) => {
    return push.write(data, 'utf8');
  });
}

function registerAppointmentBatchCalc(sub, push) {
  sub.on('data', async (data) => {
    return push.write(data, 'utf8');
  });
}

export default function registerAppointmentsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCalcFirstNextLast = context.socket('SUB', { routing: 'topic' });
  const subCalcFirstNextLastBatch = context.socket('SUB', { routing: 'topic' });
  const pushBatch = context.socket('PUSH');
  const push = context.socket('PUSH');

  pushBatch.connect('APPOINTMENT:BATCH');
  push.connect('APPOINTMENT');

  const batchWorker = context.socket('WORKER', { prefetch: 3 });
  batchWorker.connect('APPOINTMENT:BATCH');
  batchWorker.setEncoding('utf8');
  batchWorker.on('data', async (data) => {
    const appointmentIds = JSON.parse(data);
    await dueDateCalculation(appointmentIds);
    await firstNextLastAppointmentBatchCalc(appointmentIds);
    return batchWorker.ack();
  });

  const singleWorker = context.socket('WORKER', { prefetch: 3 });
  singleWorker.connect('APPOINTMENT');
  singleWorker.setEncoding('utf8');
  singleWorker.on('data', async (data) => {
    await dueDateCalculation([data]);
    await firstNextLastAppointmentCalc(data);
    return singleWorker.ack();
  });

  subCalcFirstNextLast.setEncoding('utf8');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:CREATED');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:UPDATED');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:DELETED');

  subCalcFirstNextLastBatch.setEncoding('utf8');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:CREATED:BATCH');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:UPDATED:BATCH');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:DELETED:BATCH');

  registerAppointmentCalc(subCalcFirstNextLast, push);
  registerAppointmentBatchCalc(subCalcFirstNextLastBatch, pushBatch);
}
