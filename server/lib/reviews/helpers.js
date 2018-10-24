
import moment from 'moment';
import omit from 'lodash/omit';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import {
  Appointment,
  Family,
  Patient,
  SentReview,
  Review,
  Practitioner,
} from 'CareCruModels';
import GLOBALS from '../../config/globals';
import { organizeForOutbox, generateOrganizedPatients } from '../comms/util';
import { convertIntervalStringToObject } from '../../util/time';
import reduceSuccessAndErrors from '../contactInfo/reduceSuccessAndErrors';
import Appointments from '../../../client/entities/models/Appointments';

const BUFFER_MINUTES = GLOBALS.reviews.cronIntervalMinutes;
const SAME_DAY_HOURS = GLOBALS.reviews.sameDayWindowHours;

/**
 * generateReviewsOutbox
 *
 * @param account
 * @param startDate
 * @param endDate
 * @return [outboxReviews]
 */
export async function generateReviewsOutbox({ account, startDate, endDate }) {
  endDate = endDate || moment(startDate).endOf('day').toISOString();
  const appointments = await exports.getReviewAppointments({ account, startDate, endDate });

  // Create array that the success-fail-organizer function can accept
  const patients = appointments.map((appt) => {
    const patient = appt.patient.get({ plain: true });
    patient.appointment = appt.get({ plain: true });
    return patient;
  });

  // Find which ones should actually pass
  const { success } = generateOrganizedPatients(patients, ['email', 'sms']);
  const organizedList = organizeReviewsOutboxList(success);
  const intervalObject = convertIntervalStringToObject(account.reviewsInterval);

  const outboxReviews = organizedList.map((pa) => {
    const sendDate = moment(pa.patient.appointment.endDate).add(intervalObject).toISOString();
    return {
      ...pa,
      sendDate,
    };
  });

  return orderBy(outboxReviews, 'sendDate');
}

/**
 * getPatientsNeedingReview
 */
export async function getReviewPatients({ account, startDate, endDate }) {
  const appointments = await exports.getReviewAppointments({ account, startDate, endDate });
  const patients = appointments.map((appt) => {
    const patient = appt.patient.get({ plain: true });
    patient.appointment = appt.get({ plain: true });
    return patient;
  });

  const channels = ['email', 'sms'];
  const firstSuccessAndErrors = generateOrganizedPatients(patients, channels);
  let { success, errors } = await reduceSuccessAndErrors({ account, channels, ...firstSuccessAndErrors });

  // To be removed when family reminders are implemented. If we want them...
  // This removes patients where the PoC does not have an appointment
  success = success.filter(({ patient: { appointment } }) => appointment);
  return { success, errors };
}

/**
 * getReviewAppointments
 *
 * @param reminder
 * @param startDate
 * @param endDate
 */
export async function getReviewAppointments({ account, startDate, endDate, buffer = BUFFER_MINUTES }) {
  // Cron job will default to startDate + 5 minutes
  endDate = endDate || moment(startDate).add(buffer, 'minutes').toISOString();

  // We want to make sure we send to patients {account.reviewsInterval} after their endDate
  const intervalObject = convertIntervalStringToObject(account.reviewsInterval);
  const begin = moment(startDate).subtract(intervalObject).toISOString();
  const end = moment(endDate).subtract(intervalObject).toISOString();
  const sameDayEnd = moment(end).add(SAME_DAY_HOURS, 'hours').toISOString();
  const isConfirmedQuery = account.sendUnconfirmedReviews ? {} : { isPatientConfirmed: true };

  const appointments = await Appointment.findAll({
    where: {
      ...Appointments.getCommonSearchAppointmentSchema(),
      accountId: account.id,
      endDate: {
        $gte: begin,
        $lt: end,
      },

      chairId: { $notIn: account.omitChairIds },
      practitionerId: { $notIn: account.omitPractitionerIds },
      ...isConfirmedQuery,
    },

    order: [['endDate', 'DESC']],

    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
        include: [
          {
            model: Family,
            as: 'family',
            required: false,
          },
          {
            model: Review,
            as: 'reviews',
            required: false,
          },
          {
            model: SentReview,
            as: 'sentReviews',
            required: false,
          },
          {
            model: Appointment,
            as: 'appointments',
            required: false,
            where: {
              ...Appointments.getCommonSearchAppointmentSchema(),
              accountId: account.id,
              endDate: {
                $gte: end,
                $lt: sameDayEnd,
              },
            },
          },
        ],
      },
      {
        model: SentReview,
        as: 'sentReviews',
        required: false,
      },

      // Need this for the practitioner avatar
      {
        model: Practitioner,
        as: 'practitioner',
        required: true,
      },
    ],
  });

  // Do not send to the same patient twice
  // NOTE: If the Outbox range is greater than a month, it will be innacurate because after 4 months
  // the patients will be able to get a SentReview again
  const filteredAppointments = exports.getEarliestLatestAppointment({ appointments, account });

  // Filter down to appointments who have no sentReviews and
  // whose patients have not yet reviewed the clinic
  const sendableAppointments = filteredAppointments.filter((a) => {
    const reviewNotSentForAppointment = !a.sentReviews.length;
    const patientNotReviewed = !a.patient.reviews.length; // we may want to make another range check (within a year?)
    const patientHasNoLaterAppt = !a.patient.appointments.length;
    const patientHasNoRecentSentReview = !a.patient.sentReviews.some(sr =>
      sr.isSent &&
      moment().diff(sr.createdAt, 'days') < 30,
    );

    return reviewNotSentForAppointment &&
      patientNotReviewed &&
      patientHasNoRecentSentReview &&
      a.patient.preferences.reminders &&
      patientHasNoLaterAppt;
  });

  return sendableAppointments;
}

/**
 * getEarliestLatestAppointment filters appts by getting
 * the earliest appointment that is latest in the day
 *
 * @param appointments
 * @param account
 * @returns filteredAppointments
 */
export function getEarliestLatestAppointment({ appointments, account }) {
  // Get all appointments for that patient together so we can make the decision on which appt to pick
  const patientAppts = groupBy(appointments, 'patientId');
  const filteredAppointments = [];
  forEach(patientAppts, (appts) => {
    // Group appointments by day
    // Take the earliest day but latest appt in that day
    const groupedAppts = groupBy(appts, a =>
      moment.tz(a.startDate, account.timezone).format('YYYY-MM-DD'),
    );

    // Take earliest day and latest one in that day
    const dayKeys = Object.keys(groupedAppts);
    const lastKey = dayKeys[dayKeys.length - 1];
    const earliestDay = groupedAppts[lastKey];
    const latestApptInDay = earliestDay[0];
    filteredAppointments.push(latestApptInDay);
  });

  return filteredAppointments;
}

/**
 * organizeReviewsOutboxList is a function used to organize the outbox for reminders ontop of
 * mapPatientsToReminders
 *
 * @params outboxList
 */
export function organizeReviewsOutboxList(outboxList) {
  // Assume appointment.id is the unique indicator
  // (shouldn't be multiple different reminders going out to same appointment)
  const selectorPredicate = ({ patient: { appointment } }) => appointment.id;
  const mergePredicate = (groupedArray) => {
    const primaryTypes = groupedArray.map(item => item.primaryType);
    const newObj = {
      ...groupedArray[0],
      primaryTypes,
    };

    return omit(newObj, 'primaryType');
  };

  return organizeForOutbox(outboxList, selectorPredicate, mergePredicate);
}
