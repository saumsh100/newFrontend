
import moment from 'moment';
import 'moment-timezone';
import uniqWith from 'lodash/uniqWith';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import {
  Account,
  Appointment,
  Patient,
  SentReminder,
  Reminder,
} from '../../_models';
import GLOBALS from '../../config/globals';
import { generateOrganizedPatients } from '../comms/util';
import {
  convertIntervalStringToObject,
  convertIntervalToMs,
  sortIntervalAscPredicate,
} from '../../util/time';

// TODO: add to globals file for these values
// Should always be equal to the cron interval
const CRON_MINUTES = GLOBALS.reminders.cronIntervalMinutes;
const SAME_DAY_HOURS = GLOBALS.reminders.sameDayWindowHours;

/**
 * mapPatientsToReminders will return the patients that need a reminder
 * and organized behind what would succeed and what would fail based on patientData
 *
 * @param reminders
 * @param account
 * @param startDate
 * @param endDate
 * @returns [remindersPatients] = [ { success, error }, { success, error }, ... ]
 */
export async function mapPatientsToReminders({ reminders, account, startDate, endDate }) {
  const seen = {};
  const remindersPatients = [];

  let i;
  for (i = 0; i < reminders.length; i++) {
    const reminder = reminders[i];
    const lastReminder = reminders[i - 1];

    // Get appointments that this reminder deals with
    const appointments = await exports.getAppointmentsFromReminder({ reminder, account, startDate, endDate, lastReminder });

    // If it has been seen by an earlier reminder (farther away from appt.startDate), ignore it!
    // This is why the order or reminders is so important
    const unseenAppts = appointments.filter(a => !seen[a.id]);

    // Now add it to the seen map
    unseenAppts.forEach(a => seen[a.id] = true);

    const patients = unseenAppts.map((appt) => {
      const patient = appt.patient.get({ plain: true });
      patient.appointment = appt.get({ plain: true });
      return patient;
    });

    remindersPatients.push(generateOrganizedPatients(patients, reminder.primaryTypes));
  }

  return remindersPatients;
}


/**
 * getAppointmentsFromReminder returns all of the appointments that are
 * - in that clinic
 * - within the reminder timeAway range
 * - and if we should send reminder
 *
 * @param reminder
 * @param startDate
 * @param endDate (defaults to startDate + 5 minutes)
 * @param lastReminder
 * @param buffer
 */
export async function getAppointmentsFromReminder({ reminder, account, startDate, endDate }) {
  endDate = endDate || moment(startDate).add(CRON_MINUTES, 'minutes').toISOString();

  // convert string to { weeks: 1, days: 1, ... }
  const intervalObject = convertIntervalStringToObject(reminder.interval);

  // Add the touchpoint's interval to the date we are wanting to check for
  let start = moment(startDate).add(intervalObject).toISOString();

  // If endDate is not supplied, default to using startDate + recall interval
  let end = moment(endDate).add(intervalObject).toISOString();

  // This is where we look to see if the patient has had any appointments
  // within a certain window
  let sameDayStart = moment(start).subtract(SAME_DAY_HOURS, 'hours').toISOString();

  if (reminder.isDaily) {
    const { timezone } = account;

    // Assume that this function is only run when its time to pull these
    // Or else we should check to make sure dailyRunTime is in range
    start = moment.tz(start, timezone).startOf('day').toISOString();
    end = moment.tz(end, timezone).endOf('day').toISOString();

    // Easier than conditionally querying same-day appts
    // This makes the window 0 seconds
    sameDayStart = start;
  }

  // Now we query for the appointments, those appointments patients and sentReminders, and those patients appointmemnts
  const appointments = await Appointment.findAll({
    where: {
      isDeleted: false,
      isCancelled: false,
      isShortCancelled: false,
      isPending: false,
      accountId: reminder.accountId,
      startDate: {
        $gte: start,
        $lt: end,
      },

      practitionerId: {
        $notIn: reminder.omitPractitionerIds,
      },
    },

    // Important for grabbing latest sentReminder and checking if it was within window or lastReminder
    // and this one. If it is, we ignore this touchpoint
    order: [
      ['startDate', 'ASC'],
      [{ model: SentReminder, as: 'sentReminders' }, 'createdAt', 'desc']
    ],

    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
        include: [{
          model: Appointment,
          as: 'appointments',
          required: false,
          where: {
            isDeleted: false,
            isCancelled: false,
            isShortCancelled: false,
            isPending: false,
            accountId: reminder.accountId,
            // Do not include the upper-bound, or else you'll always get the same appointment as above
            startDate: {
              $gte: sameDayStart,
              $lt: start,
            },
          },
        }],
      },
      {
        model: SentReminder,
        as: 'sentReminders',
        required: false,
      },
    ],
  });

  return exports.filterReminderAppointments({ appointments, reminder });
}

/**
 * filterReminderAppointments will group the appointments by the buffer interval and then
 * for each group it will filter out duplicate patients as well as appointments
 * that are confirmed if ignoreSendIfConfirmed=true
 *
 * @param appointments
 * @param reminder
 * @return [filteredAppointments]
 */
export function filterReminderAppointments({ appointments, reminder }) {
  if (!appointments.length) return [];

  // First group appointments by the buffer time (could be every 24 hours, every 6 hours, etc.)
  const floorTime = appointments[0].startDate;
  const groupedAppointmentsByBuffer = groupBy(appointments, (a) => {
    return Math.floor(moment(a.startDate).diff(floorTime, 'hours') / SAME_DAY_HOURS);
  });

  // Now, for each group, ensure the appointments have unique patientIds
  // Then if ignoreSendIfConfirmed if true, filter out the confirmed ones
  let filteredAppointments = [];
  forEach(groupedAppointmentsByBuffer, (appointmentsGroup) => {
    let filteredAppointmentsGroup = uniqWith(appointmentsGroup, (a, b) =>
      a.patient.id === b.patient.id
    );

    filteredAppointmentsGroup = filteredAppointmentsGroup.filter(a =>
      exports.shouldSendReminder({ appointment: a, reminder })
    );

    filteredAppointments = [...filteredAppointments, ...filteredAppointmentsGroup];
  });

  return filteredAppointments;
}

/**
 * shouldSendReminder returns a boolean if the appointment is in need
 * of a reminder being sent
 * - checks if reminder was already sent
 * - and if it is sendable according to patient preferences
 *
 * @param appointment
 * @param reminder
 * @param lastReminder
 * @returns {boolean}
 */
export function shouldSendReminder({ appointment, reminder }) {
  const { sentReminders, patient } = appointment;
  const { preferences, appointments = [] } = patient;

  // These are appointments that are within the "same day" window, don't send a reminder
  // This is because a reminder for that appointment was probably already sent
  if (appointments.length) {
    return false;
  }

  if (reminder.ignoreSendIfConfirmed && exports.isAppointmentConfirmed(appointment, reminder)) {
    return false;
  }

  // We check interval because they can change and add different reminders
  // We don't send auto-reminders that are farther away than a previously sent one
  const reminderAlreadySentOrLongerAway = sentReminders.some((s) => {
    if (!s.interval) {
      // For older sentReminders that have lengthSeconds, we can ignore
      return false;
    }

    const sentReminderMs = convertIntervalToMs(s.interval);
    const reminderMs = convertIntervalToMs(reminder.interval);
    return (s.reminderId === reminder.id) || (reminderMs >= sentReminderMs);
  });

  return !reminderAlreadySentOrLongerAway && preferences.reminders;
}

/**
 * isAppointmentConfirmed is a function that determines if the appointment is
 * "confirmed". it takes the reminders settings into account
 *
 * @param appointment
 * @param reminder
 * @return {isPreConfirmed|{type}|boolean}
 */
export function isAppointmentConfirmed(appointment, reminder) {
  if (reminder.isCustomConfirm) {
    return appointment.isPreConfirmed || appointment.isPatientConfirmed;
  } else {
    return appointment.isPatientConfirmed;
  }
}

/**
 * getValidSmsReminders will return the sms reminders that are valid for confirmations
 * so that the text message will confirm it
 *
 * @param patientId
 * @param accountId
 * @param date
 * @return [sentReminders]
 */
export async function getValidSmsReminders({ accountId, patientId, date }) {
  // Confirming valid SMS Reminder for patient
  const sentReminders = await SentReminder.findAll({
    where: {
      accountId,
      patientId,
      isConfirmed: false,
      isConfirmable: true,
      primaryType: 'sms',
    },

    order: [['createdAt', 'asc']],
    include: [
      { model: Appointment, as: 'appointment' },
      { model: Reminder, as: 'reminder' },
    ],
  });

  return sentReminders.filter(({ appointment }) => {
    // - if appointment is upcoming or is cancelled
    const isAfter = moment(appointment.startDate).isAfter(date);
    return !appointment.isCancelled && isAfter && !appointment.isDeleted;
  });
}

/**
 * fetchActiveReminders is used by the outbox functions to
 * pull active, relevant (based on startDate, endDate) reminders that are ordered
 * by the interval
 *
 * @param account
 * @param startDate
 * @param endDate
 * @return {Promise.<Array.<Model>>}
 */
export async function fetchActiveReminders({ account, startDate, endDate }) {
  const t = d => moment.tz(d, account.timezone).format('HH:mm:ss');
  const start = t(startDate);
  const end = t(endDate);

  // Fetch active reminders for the account that need to be sent
  const reminders = await Reminder.findAll({
    raw: true,
    where: {
      accountId: account.id,
      isDeleted: false,
      isActive: true,
      interval: { $not: null },
      $or: [
        { isDaily: false },
        {
          isDaily: true,
          dailyRunTime: {
            $gte: start,
            $lt: end,
          },
        },
      ],
    },
  });

  // Sort reminders by interval so that we send to earliest first
  return reminders.sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));
}

/**
 * fetchAccountsAndActiveReminders is used by the reminders job to
 * pull active, relevant (based on startDate, endDate) reminders that are ordered
 * by the interval
 *
 * @param account
 * @param startDate
 * @param endDate
 * @return {Promise.<Array.<Model>>}
 */
export async function fetchAccountsAndActiveReminders({ startDate, endDate }) {
  const accounts = await Account.findAll({
    where: { canSendReminders: true },
    include: [{
      model: Reminder,
      as: 'reminders',
      where: {
        isDeleted: false,
        isActive: true,
        interval: { $not: null },
      },
    }],
  });

  // Filter out reminders and sort by interval
  accounts.forEach((account) => {
    account.reminders = account.reminders
      .filter(generateIsActiveReminder({ account, startDate, endDate }))
      .sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));
  });

  return accounts;
}

/**
 * generateIsActiveReminder is a thunk that will return a predicate to filter
 * out isDaily reminders in an array whose dailyRunTime is not in the range
 *
 * @param account
 * @param startDate
 * @param endDate
 */
export function generateIsActiveReminder({ account, startDate, endDate }) {
  return (reminder) => {
    if (!reminder.isDaily) return true;
    // If it's a daily reminder, ensure the dailyRunTime is within the range
    // or else it wouldn't get sent in the range and no need to return
    const { dailyRunTime } = reminder;
    const t = d => moment.tz(d, account.timezone).format('HH:mm:ss');
    const start = t(startDate);
    const end = t(endDate);
    return (start <= dailyRunTime) && (dailyRunTime < end);
  };
}
