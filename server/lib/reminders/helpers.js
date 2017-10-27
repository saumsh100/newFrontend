
import moment from 'moment';
import {
  Appointment,
  Patient,
  SentReminder,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';

// Made an effort to throw all easily testable functions into here
export async function mapPatientsToReminders({ reminders, account, date }) {
  const seen = {};
  const remindersPatients = [];
  for (const reminder of reminders) {
    // Get appointments that this reminder deals with
    const appointments = await exports.getAppointmentsFromReminder({ reminder, account, date });

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
 */
export async function getAppointmentsFromReminder({ reminder, date }) {
  const end = moment(date).add(reminder.lengthSeconds, 'seconds').toISOString();

  const appointments = await Appointment.findAll({
    where: {
      isDeleted: false,
      isCancelled: false,
      accountId: reminder.accountId,
      startDate: {
        $between: [date, end],
      },
    },

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
