
import moment from 'moment';
import difference from 'lodash/difference';
import logger from '../../../config/logger';
import {
  Account,
  Appointment,
  AppointmentCode,
  DeliveredProcedure,
  Patient,
  PatientRecall,
} from '../../../_models';
import { convertIntervalStringToObject } from '../../../util/time';
import unionAndMerge from '../../../util/unionAndMerge';

// Use to check if the appointment's reason string contains one of the types
const reasonMatchesType = (reason, types) => types.some(t => reason.indexOf(t) > -1);

/**
 * getPatientsThatAreDue is an async function that will get the patients that are due for something
 * based on patientRecalls and future booked appointments and their type
 *
 * @param {uuid} config.accountId - id of the account
 * @param {date} config.date - usually date of "now"
 * @param {[string]} config.types - types of the appointment that are needed to be checked
 * @param {[uuid]} config.patientIds - an array of patientIds that we specifically want to check
 * @param {string} config.patientAttribute - attribute that we are checking lastDate for
 * @param {object} config.codesQuery - a where query for the appointmentCodes
 * @return {[patients]} array of patient models
 */
export async function getPatientsThatAreDue(config) {
  const {
    accountId,
    date,
    types,
    patientIds,
    patientAttribute,
    codesQuery,
  } = config;

  const idsQuery = patientIds || { $not: null };
  let patients = await Patient.findAll({
    attributes: ['id', patientAttribute],
    where: {
      id: idsQuery,
      accountId,
      [patientAttribute]: { $lt: date },
    },

    order: [
      [{ model: PatientRecall, as: 'patientRecalls' }, 'dueDate', 'ASC'],
    ],

    include: [
      {
        model: PatientRecall,
        as: 'patientRecalls',
        attributes: ['dueDate', 'type'],
        where: {
          type: { $in: types },
        },

        required: false,
      },
      {
        model: Appointment,
        as: 'appointments',
        attributes: ['id', 'reason'],
        where: {
          isCancelled: false,
          isMissed: false,
          isPending: false,
          startDate: { $gt: date },
        },

        include: [
          {
            model: AppointmentCode,
            as: 'appointmentCodes',
            where: { code: codesQuery },
            required: false,
          },
        ],

        required: false,
      },
    ],
  });

  return patients
    .map((p) => {
      // Can't do this in query cause we don't have lasyHygieneApptDate when the "where" clause gets applied
      p.patientRecalls = p.patientRecalls.filter(r => p[patientAttribute] < r.dueDate);

      // Get future appointments of this "type", through either reason or appointmentCodes
      p.appointments = p.appointments.filter(a => reasonMatchesType(a.reason, types) || a.appointmentCodes.length);

      return p;
    })
    .filter((p) => {
      // Return patients with NO future booked appointments of that type
      return !p.appointments.length;
    });
}

/**
 * getPatientIdsWithChangedAppointmentsSinceDate is an async function that returns an array of patientIds
 * of patients that have had changed appointments since a supplied date
 *
 * @param date
 * @param accountId
 * @return [patientIds]
 */
export async function getPatientIdsWithChangedAppointmentsSinceDate(date, accountId, omitPatientIds = []) {
  const appointmentsGroupByPatientId = await Appointment.findAll({
    raw: true,
    group: ['patientId'],
    paranoid: false,
    attributes: ['patientId'],
    where: {
      patientId: { $notIn: omitPatientIds },
      accountId,
      $or: {
        createdAt: { $gte: date },
        updatedAt: { $gte: date },
        deletedAt: { $gte: date },
      },
    },
  });

  return appointmentsGroupByPatientId.map(g => g.patientId);
}

/**
 * getPatientIdsWithChangedPatientRecallsSinceDate is an async function that returns an array of patientIds
 * of patients that have had changed patientRecalls since a supplied date
 *
 * @param date - an isoStringDate
 * @param accountId - uuid of the account
 * @param omitPatientIds - array of patientIDs you don't care about returning
 * @return [patientIds] - array of patientIds
 */
export async function getPatientIdsWithChangedPatientRecallsSinceDate(date, accountId, omitPatientIds = []) {
  const patientRecallsGroupByPatientId = await PatientRecall.findAll({
    raw: true,
    group: ['patientId'],
    paranoid: false,
    attributes: ['patientId'],
    where: {
      patientId: { $notIn: omitPatientIds },
      accountId,
      $or: {
        createdAt: { $gte: date },
        updatedAt: { $gte: date },
        deletedAt: { $gte: date },
      },
    },
  });

  return patientRecallsGroupByPatientId.map(g => g.patientId);
}

/**
 * getPatientIdsWithChangedPatientRecallsSinceDate is an async function that returns an array of patientIds
 * of patients that have had changed patientRecalls since a supplied date
 *
 * @param date - an isoStringDate
 * @param accountId - uuid of the account
 * @param omitPatientIds - array of patientIDs you don't care about returning
 * @return [patientIds] - array of patientIds
 */
export async function getChangedPatientsSinceDate(date, accountId, omitPatientIds = []) {
  const changedPatients =  await Patient.findAll({
    raw: true,
    paranoid: false,
    attributes: ['id'],
    where: {
      id: { $notIn: omitPatientIds },
      accountId,
      $or: {
        createdAt: { $gte: date },
        updatedAt: { $gte: date },
        deletedAt: { $gte: date },
      },
    },
  });

  return changedPatients.map(p => p.id);
}

/**
 * getPatientsWithChangedDueDateInfo is an async function that finds the patients which could have
 * changed data that would thus cause a change in the calculated dueDate function
 *
 * @param date - an isoStringDate
 * @param accountId - uuid of the account
 * @return [patientIds] - array of patientIds
 */
export async function getPatientsWithChangedDueDateInfo(date, accountId) {
  let patientIds = [];

  const changedApptsPatientIds = await getPatientIdsWithChangedAppointmentsSinceDate(date, accountId);
  patientIds = changedApptsPatientIds.concat(patientIds);

  const changedRecallsPatientIds = await getPatientIdsWithChangedPatientRecallsSinceDate(date, accountId, patientIds);
  patientIds = changedRecallsPatientIds.concat(patientIds);

  const changedPatientIds = await getChangedPatientsSinceDate(date, accountId, patientIds);
  patientIds = changedPatientIds.concat(patientIds);

  return patientIds;
}

/**
 * updatePatientDueDateFromPatientRecalls is an async function that will update patient
 * dueDates by pulling patients that have PatientRecalls with the right type
 *
 * @param  {uuid} config.accountId - uuid of accountId
 * @param  {date|isoString} config.date - date of the cron job usually, also helpful for testing
 * @param  {[string]} config.hygieneTypes - an array of strings that are associated to the reasons for "hygiene"
 * @param  {[string]} config.recallTypes - an array of strings that are associated to the reasons for "recall"
 * @param  {[array]} config.patientIds - array of patientIds to update if not sent then assume all patients
 * @param  {[array]} config.hygieneInterval - interval string of the account's fallback time for one being dueForHygiene
 * @param  {[array]} config.recallInterval - interval string of the account's fallback time for one being dueForRecall
 * @return {[array]} an array of update counts (only useful for checking length to see how many were updated)
 */
export async function updatePatientDueDateFromPatientRecalls(config) {
  const {
    accountId,
    date,
    hygieneTypes,
    recallTypes,
    patientIds,
    hygieneInterval,
    recallInterval,
  } = config;

  let patientsDueForHygiene = await getPatientsThatAreDue({
    accountId,
    date,
    types: hygieneTypes,
    patientIds,
    patientAttribute: 'lastHygieneDate',
    codesQuery: { $like: '111%' },
  });

  let patientsDueForRecall = await getPatientsThatAreDue({
    accountId,
    date,
    types: recallTypes,
    patientIds,
    patientAttribute: 'lastRecallDate',
    codesQuery: { $in: ['00121', '01202'] },
  });

  patientsDueForHygiene = patientsDueForHygiene
    .map((patient) => {
      const p = patient.get({ plain: true });
      p.dueForHygieneDate = p.patientRecalls.length ?
        p.patientRecalls[0].dueDate : (hygieneInterval ?
            moment(p.lastHygieneDate).add(convertIntervalStringToObject(hygieneInterval)).toISOString() :
            null
        );

      return p;
    })
    .filter(p => p.dueForHygieneDate);

  patientsDueForRecall = patientsDueForRecall
    .map((patient) => {
      const p = patient.get({ plain: true });
      p.dueForRecallExamDate = p.patientRecalls.length ?
        p.patientRecalls[0].dueDate : (recallInterval ?
           moment(p.lastRecallDate).add(convertIntervalStringToObject(recallInterval)).toISOString() :
            null
        );

      return p;
    }).filter(p => p.dueForRecallExamDate);

  const patientsDue = unionAndMerge(patientsDueForHygiene, patientsDueForRecall);
  const patientsDueIds = patientsDue.map(p => p.id);

  // If we are updating ALL the patients for an account
  // then update everyone's dueDates that are not due to null
  let nullUpdateIdsQuery = { $notIn: patientsDueIds };
  if (patientIds) {
    // If we are only updating a small subset of patients,
    // set the ones that are no longer due to null
    nullUpdateIdsQuery = { $in: difference(patientIds, patientsDueIds) }
  }

  // Set values to null now that they are no longer due
  await Patient.update({
    dueForHygieneDate: null,
    dueForRecallExamDate: null,
    recallPendingAppointmentId: null,
    hygienePendingAppointmentId: null,
  }, {
    where: {
      id: nullUpdateIdsQuery,
      accountId,
    },
  });

  const patientsDuePromises = patientsDue.map(({ id, dueForHygieneDate, dueForRecallExamDate }) =>
    Patient.update(
      // if undefined or falsey, we will set to null or else it won't update at all
      { dueForHygieneDate: dueForHygieneDate || null, dueForRecallExamDate: dueForRecallExamDate || null },
      { where: { id } },
    ).catch((err) => {
      logger.error(
        `Failed updating dueForHygieneDate=${dueForHygieneDate} ` +
        `and dueForRecallExamDate=${dueForRecallExamDate} ` +
        `for patient with id=${patient.id}`
      );

      logger.error(err);
    })
  );

  return await Promise.all(patientsDuePromises);
}
