
import moment from 'moment';
import { Account, Appointment, Patient } from '../../../_models';
import { calcFirstNextLastAppointment } from '../../../lib/firstNextLastAppointment';
import updateLastProcedureForAccount from '../../../lib/lastProcedure/updateLastProcedureForAccount';
import { getConfigsForLastProcedure } from '../../../lib/lastProcedure/runLastProcedureCronForAccounts';
import lastProcedureData from '../../../lib/lastProcedure/lastProcedureData';
import { getConfigsForDueDates, updatePatientDueDatesForAccount } from '../../../lib/dueDate';

const runFirstNextLastCalc = async appointments => calcFirstNextLastAppointment(
  appointments,
  async (currentPatient, appointmentsObj) => {
    await Patient.update(
      { ...appointmentsObj },
      { where: { id: currentPatient } },
    );
  },
);

/**
 * does the firstNextLast calculation by grabbing all appointments for a single patient
 */
async function calcPatientFNLAllApps(app) {
  const appointments = await Appointment.findAll({
    raw: true,
    where: {
      accountId: app.accountId,
      patientId: app.patientId,
      ...Appointment.getCommonSearchAppointmentSchema(),
    },
    order: [['startDate', 'DESC']],
  });

  return runFirstNextLastCalc(appointments);
}

/**
 * does the firstNextLast calculation without grabbing all the patients appointments
 * unless necessary.
 *
 */
function calcPatientFNLSingleApp(app, patient, sDate) {
  const today = new Date().toISOString();
  const startDate = moment(sDate).toISOString();
  const nextApptDate = patient.nextApptDate ? moment(patient.nextApptDate).toISOString() : today;

  if (startDate > today && !patient.nextApptId) {
    const patientData = {
      ...patient,
      nextApptId: app.id,
      nextApptDate: startDate,
    };

    return updatePatient(patientData);
  } else if (startDate > today && startDate < nextApptDate) {
    const patientData = {
      ...patient,
      nextApptId: app.id,
      nextApptDate: startDate,
    };

    return updatePatient(patientData);
  } else if (startDate < today && !patient.lastApptId && !patient.firstApptId) {
    const patientData = {
      ...patient,
      lastApptId: app.id,
      lastApptDate: startDate,
      firstApptId: app.id,
      firstApptDat: startDate,
    };

    return updatePatient(patientData);
  }

  return calcPatientFNLAllApps(app);
}

function updatePatient(patientData) {
  return Patient.update(patientData, { where: { id: patientData.id } });
}

/**
 * does the firstNextLast calculation for a single appointment
 *
 * @param  {id} - id of an appointment
 */
async function firstNextLastAppointmentCalc(id) {
  const app = await Appointment.findOne({
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
  });

  if (app) {
    const { patient, startDate } = app;

    if (!app.isDeleted && !app.isPending && !app.isMissed && !app.isCancelled) {
      return calcPatientFNLSingleApp(app, patient, startDate);
    }

    // If an appointment was cancelled deleted or changed to pending reset FNL for this patient.
    return calcPatientFNLAllApps(app);
  }
}

/**
 * does the firstNextLast calculation of a batch of appointments from the connector
 *
 * @param  {[appointmentIds]} - array of appointment ids that were created/updated
 */
export async function firstNextLastAppointmentBatchCalc(appointmentIds) {
  const batchedApps = await Appointment.findAll({
    where: {
      id: appointmentIds,
      ...Appointment.getCommonSearchAppointmentSchema(),
      patientId: { $not: null },
    },
    attributes: ['patientId'],
  });

  const patientIds = batchedApps.map(app => app.patientId);

  const allApps = await Appointment.findAll({
    raw: true,
    where: {
      ...Appointment.getCommonSearchAppointmentSchema(),
      patientId: patientIds,
    },
    attributes: ['id', 'startDate', 'patientId'],
    order: [['patientId', 'DESC'], ['startDate', 'DESC']],
  });

  return runFirstNextLastCalc(allApps);
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
      patientId: { $not: null },
    },
  });

  if (appointments.length) {
    const patientIds = appointments.map(p => p.patientId);
    const { accountId } = appointments[0];
    const account = await Account.findById(accountId);
    const lastHygieneConfigs = await getConfigsForLastProcedure({
      account,
      ...lastProcedureData.lastHygiene,
    });
    const lastRecallConfigs = await getConfigsForLastProcedure({
      account,
      ...lastProcedureData.lastRecall,
    });
    await updateLastProcedureForAccount({
      account,
      patientIds,
      ...lastHygieneConfigs,
      ...lastProcedureData.lastHygiene,
    });

    await updateLastProcedureForAccount({
      account,
      patientIds,
      ...lastRecallConfigs,
      ...lastProcedureData.lastRecall,
    });

    // Fetch account and other configurations that are important for the dueDates job
    const configurationsMap = await getConfigsForDueDates(account);
    const date = (new Date()).toISOString();
    await updatePatientDueDatesForAccount({
      account,
      date,
      patientIds,
      ...configurationsMap,
    });
  }
}

function registerAppointmentCalc(sub, push) {
  sub.on('data', async data => push.write(data, 'utf8'));
}

function registerAppointmentBatchCalc(sub, push) {
  sub.on('data', async data => push.write(data, 'utf8'));
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
