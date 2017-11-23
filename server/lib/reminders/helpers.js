
import moment from 'moment';
import {
  Appointment,
  Patient,
  SentReminder,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';
import { h2s } from '../../util/time';

// Should always be greater than or equal to reminder cron job interval
const BUFFER_SECONDS =  h2s(1) / 2;

// Made an effort to throw all easily testable functions into here
export async function mapPatientsToReminders({ reminders, account, date }) {
  const seen = {};
  const remindersPatients = [];

  let i;
  for (i = 0; i < reminders.length; i++) {
    const reminder = reminders[i];
    const lastReminder = reminders[i - 1];

    // Get appointments that this reminder deals with
    const appointments = await exports.getAppointmentsFromReminder({ reminder, account, date, lastReminder });

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

    remindersPatients.push(generateOrganizedPatients(patients, reminder.primaryType));
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
 * @param date
 * @param lastReminder
 */
export async function getAppointmentsFromReminder({ reminder, date, lastReminder }) {
  // TODO: add buffer here so that patients aren't receiving reminders to close to one another
  const start = moment(date).add(reminder.lengthSeconds, 'seconds').toISOString();
  const end = moment(start).add(BUFFER_SECONDS, 'seconds').toISOString();

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

  // We check lengthSeconds because they can change and add different reminders
  // We don't send auto-reminders that are farther away than a previously sent one
  const reminderAlreadySentOrLongerAway = sentReminders.some((s) => {
    return (s.reminderId === reminder.id) || (reminder.lengthSeconds >= s.lengthSeconds);
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
