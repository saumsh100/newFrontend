
import moment from 'moment';
import {
  Appointment,
  Patient,
  SentReminder,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';
import { m2s, convertIntervalStringToObject, convertIntervalToMs } from '../../util/time';

// TODO: add to globals file for these values
// Should always be equal to the cron interval
const BUFFER_SECONDS = 60 * 5;

/**
 * mapPatientsToReminders will return the patients that need a reminder
 * and organized behind what would succeed and what would fail based on patientData
 *
 * @param reminders
 * @param account
 * @param date
 * @returns {Promise.<Array>}
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

    /*console.log(startDate);
    console.log(endDate);*/
    //console.log(reminder.interval);
    //console.log(appointments.map(a => a.startDate));

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

  // If endDate is not supplied, default to using startDate + recall interval + buffer
  const end = moment(endDate || startDate).add(intervalObject).add(buffer, 'seconds').toISOString();

  // console.log(`start --> end ${start} --> ${end}`);

  const appointments = await Appointment.findAll({
    where: {
      isDeleted: false,
      isCancelled: false,
      isShortCancelled: false,
      isPending: false,
      accountId: reminder.accountId,
      startDate: {
        $between: [start, end],
      },
    },

    // Important for grabbing latest sentReminder and checking if it was within window or lastReminder
    // and this one. If it is, we ignore this touchpoint
    order: [[{ model: SentReminder, as: 'sentReminders' }, 'createdAt', 'desc']],

    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
      },
      {
        model: SentReminder,
        as: 'sentReminders',
        required: false,
      },
    ],
  });

  return appointments.filter(appointment => shouldSendReminder({ appointment, reminder, lastReminder }));
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
  const preferences = patient.preferences;
  const lastSentReminder = sentReminders[0];

  if (lastReminder) {
    // TODO: Check if the lastSentReminder was in the window
    // TODO: this needs to be done when singular sending is possible
  }

  // We check interval because they can change and add different reminders
  // We don't send auto-reminders that are farther away than a previously sent one
  const reminderAlreadySentOrLongerAway = sentReminders.some((s) => {
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
