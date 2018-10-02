
import { SentReminder, SentRemindersPatients, Appointment, Reminder, Patient } from 'CareCruModels';
import groupEvents from '../helpers';
import Appointments from '../../../../client/entities/models/Appointments';

const reminderGroupingConditional = (sentReminder, nextSentReminder) => {
  if (
    !sentReminder ||
    !nextSentReminder ||
    typeof sentReminder !== typeof nextSentReminder
  ) {
    console.error('Missing or invalid parameters: sentReminder and nextSentReminder');
    return false;
  }

  if (
    sentReminder.isFamily !== nextSentReminder.isFamily ||
    sentReminder.reminder.interval !== nextSentReminder.reminder.interval
  ) {
    return false;
  }
  return (
    (sentReminder.isFamily ||
      sentReminder.sentRemindersPatients[0].appointment.id ===
      nextSentReminder.sentRemindersPatients[0].appointment.id) &&
    sentReminder.primaryType !== nextSentReminder.primaryType
  );
};

export async function fetchReminderEvents({ patientId, accountId, query }) {
  const sentReminders = await SentReminder.findAll({
    nest: true,
    where: {
      accountId,
      contactedPatientId: patientId,
      isSent: true,
    },
    include: [
      {
        model: Reminder,
        as: 'reminder',
        required: true,
        attributes: ['interval'],
      },
      {
        model: SentRemindersPatients,
        as: 'sentRemindersPatients',
        include: [
          {
            model: Appointment,
            as: 'appointment',
            where: {
              accountId,
              ...Appointments.getCommonSearchAppointmentSchema()
            },
            attributes: ['id', 'startDate'],
          },
          {
            model: Patient,
            as: 'patient',
            where: { accountId },
          },
        ],
      },
    ],
    attributes: ['id', 'contactedPatientId', 'createdAt', 'isConfirmed', 'primaryType', 'isFamily'],
    order: [['createdAt', 'DESC']],
    group: ['reminder.interval', 'SentReminder.id', 'reminder.id'],
    limit: 5,
    ...query,
  });
  const sentRemindersClean = sentReminders.map(sentReminder => sentReminder.get({ plain: true }));

  return groupEvents(sentRemindersClean, reminderGroupingConditional, { primaryType: 'sms/email' });
}

export function buildReminderEvent({ data }) {
  return {
    id: Buffer.from(`reminder-${data.id}`)
      .toString('base64'),
    type: 'Reminder',
    metaData: data,
  };
}
