
import moment from 'moment';
import { r } from '../../config/thinky';
import { Appointment, SentReminder } from '../../models';

// Made an effort to throw all easily testable functions into here

/**
 * getAppointmentsFromReminder returns all of the appointments that are
 * - in that clinic
 * - within the reminder timeAway range
 * - and if we should send reminder
 *
 * @param reminder
 * @param date
 */
export async function getAppointmentsFromReminder({ reminder, date }) {
  const start = r.ISO8601(date);
  const end = start.add(reminder.lengthSeconds);
  const appointments = await Appointment
    .filter({
      accountId: reminder.accountId,
    })
    .filter(r.row('startDate').during(start, end).and(r.row('isDeleted').eq(false)))
    .getJoin({ patient: true, sentReminders: true })
    .run();

  // .getJoin().filter() does not work in order, therefore we gotta filter after the fetch
  return appointments.filter(appointment => shouldSendReminder({ appointment, reminder }));
}

/**
 * shouldSendReminder returns a boolean if the appointment is in need
 * of a reminder being sent
 * - checks if reminder was already sent
 * - and if it is sendable according to patient preferences
 *
 * @param appointment
 * @param reminder
 * @returns {boolean}
 */
export function shouldSendReminder({ appointment, reminder }) {
  const { sentReminders, patient } = appointment;

  const preferences = patient.preferences;

  const reminderAlreadySentOrLongerAway = sentReminders.some((s) => {
    return (s.reminderId === reminder.id) || (reminder.lengthSeconds > s.lengthSeconds);
  });

  return !reminderAlreadySentOrLongerAway && preferences.reminders;
}

/**
 *
 */
export async function getValidSmsReminders({ accountId, patientId, date }) {
  // Confirming valid SMS Reminder for patient
  const sentReminders = await SentReminder
    .filter({
      accountId,
      patientId,
      isConfirmed: false,
      primaryType: 'sms',
    })
    .orderBy('createdAt')
    .getJoin({ appointment: true })
    .run();

  return sentReminders.filter(({ appointment }) => {
    // - if appointment is upcoming or is cancelled
    const isAfter = moment(appointment.startDate).isAfter(date);
    return !appointment.isCancelled && isAfter && !appointment.isDeleted;
  });
}
