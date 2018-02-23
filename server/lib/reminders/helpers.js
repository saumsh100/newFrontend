
import moment from 'moment';
import uniqWith from 'lodash/uniqWith';
import {
  Appointment,
  Patient,
  SentReminder,
} from '../../_models';
import GLOBALS from '../../config/globals';
import { generateOrganizedPatients } from '../comms/util';
import { m2s, convertIntervalStringToObject, convertIntervalToMs } from '../../util/time';

// TODO: add to globals file for these values
// Should always be equal to the cron interval
const BUFFER_SECONDS = 60 * GLOBALS.reminders.cronIntervalMinutes;
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
 * @param endDate
 * @param lastReminder
 * @param buffer
 */
export async function getAppointmentsFromReminder({ reminder, startDate, endDate, lastReminder, buffer = BUFFER_SECONDS }) {
  // TODO: add buffer here so that patients aren't receiving reminders to close to one another
  // convert string to { weeks: 1, days: 1, ... }
  const intervalObject = convertIntervalStringToObject(reminder.interval);
  const start = moment(startDate).add(intervalObject).toISOString();

  // This is where we look to see if the patient has had any appointments
  // within a certain window
  const sameDayStart = moment(start).subtract(SAME_DAY_HOURS, 'hours').toISOString();

  // If endDate is not supplied, default to using startDate + recall interval + buffer
  const end = moment(endDate || startDate).add(intervalObject).add(buffer, 'seconds').toISOString();

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

  // Assuming this array is ordered by startDate ASC, make sure there is only 1 appt per patient
  const sameDayAppointments = uniqWith(appointments, (appA, appB) => {
    return appA.patient.id === appB.patient.id;
  });

  return sameDayAppointments.filter(appointment => shouldSendReminder({ appointment, reminder, lastReminder }));
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
export function shouldSendReminder({ appointment, reminder, lastReminder }) {
  const { sentReminders, patient } = appointment;
  const { preferences, appointments = [] } = patient;

  // These are appointments that are within the "same day" window, don't send a reminder
  // This is because a reminder for that appointment was probably already sent
  if (appointments.length) {
    return false;
  }

  const lastSentReminder = sentReminders[0];
  if (lastReminder) {
    // TODO: Check if the lastSentReminder was in the window to account for manual reminders
    // TODO: this needs to be done when manual sending is finished
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
 *
 */
export async function getValidSmsReminders({ accountId, patientId, date }) {
  // Confirming valid SMS Reminder for patient
  /*const sentReminders = await SentReminder
    .filter({
      accountId,
      patientId,
      isConfirmed: false,
      primaryType: 'sms',
    })
    .orderBy('createdAt')
    .getJoin({ appointment: true })
    .run();*/

  const sentReminders = await SentReminder.findAll({
    where: {
      accountId,
      patientId,
      isConfirmed: false,
      isConfirmable: true,
      primaryType: 'sms',
    },

    order: [['createdAt', 'asc']],
    include: [{
      model: Appointment,
      as: 'appointment',
    }],
  });

  return sentReminders.filter(({ appointment }) => {
    // - if appointment is upcoming or is cancelled
    const isAfter = moment(appointment.startDate).isAfter(date);
    return !appointment.isCancelled && isAfter && !appointment.isDeleted;
  });
}
