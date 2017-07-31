
import moment from 'moment';
import { Appointment, Patient, SentReminder } from '../../_models';

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
  const end = moment(date).add(reminder.lengthSeconds, 'seconds').toISOString();
  const appointments = await Appointment.findAll({
    where: {
      isDeleted: false,
      accountId: reminder.accountId,
      startDate: {
        $between: [date, end],
      },
    },

    include: [
      {
        model: Patient,
        as: 'patient',
      },
      {
        model: SentReminder,
        as: 'sentReminders',
      },
    ],
  });

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
      primaryType: 'sms',
    },

    order: ['createdAt'],
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
