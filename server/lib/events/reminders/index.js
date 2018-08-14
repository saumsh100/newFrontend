
import { SentReminder, Appointment, Reminder } from '../../../_models';
import groupEvents from '../helpers';

const checkGroupingFunc = (sentReminder, nextSentReminder) => (
  sentReminder.reminder.interval === nextSentReminder.reminder.interval
&& sentReminder.appointment.id === nextSentReminder.appointment.id
&& sentReminder.primaryType !== nextSentReminder.primaryType);

export async function fetchReminderEvents({ patientId, accountId, query }) {
  const sentReminders = await SentReminder.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      patientId,
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
        model: Appointment,
        as: 'appointment',
        where: {
          accountId,
          patientId,
          isDeleted: false,
          isCancelled: false,
          isPending: false,
          isMissed: false,
        },
        required: true,
        attributes: ['id', 'startDate'],
      },
    ],
    attributes: ['id', 'createdAt', 'isConfirmed', 'primaryType'],
    order: [['createdAt', 'DESC']],
    group: ['appointment.id', 'reminder.interval', 'SentReminder.id'],
    ...query,
  });

  return groupEvents(sentReminders, checkGroupingFunc, { primaryType: 'sms/email' });
}

export function buildReminderEvent({ data }) {
  return {
    id: Buffer.from(`reminder-${data.id}`).toString('base64'),
    type: 'Reminder',
    metaData: data,
  };
}
