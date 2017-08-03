
import moment from 'moment';
import { r } from '../../config/thinky';
import { Appointment, SentReminder } from '../../models';
import { SentReminder as _SentReminder, Appointment as _Appointment } from '../../_models';

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

  const allAppointments = await Appointment.run();

  // console.log(allAppointments);

  const appointments = await Appointment
    .filter({ accountId: reminder.accountId })
    .filter(r.row('startDate').during(start, end).and(r.row('isDeleted').eq(false)))
    .getJoin({ patient: true, sentReminders: true })
    .run();

  // console.log(appointments);
  // console.log(reminder);
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

export async function getValidSmsRemindersSequelize({ accountId, patientId, date }) {
  // Confirming valid SMS Reminder for patient
  const sentReminders = await _SentReminder.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      patientId,
      isConfirmed: false,
      primaryType: 'sms',
    },
    include: [
      {
        model: _Appointment,
        as: 'appointment',
      },
    ],
  });

  return sentReminders.filter(({ appointment }) => {
    // - if appointment is upcoming or is cancelled
    const isAfter = moment(appointment.startDate).isAfter(date);
    return !appointment.isCancelled && isAfter && !appointment.isDeleted;
  });
}
