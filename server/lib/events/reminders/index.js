import { SentReminder, Appointment, Reminder } from '../../../_models';

export async function fetchReminderEvents({ patientId, accountId, query }) {
  return SentReminder.findAll({
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
          isDeleted: false,
          isCancelled: false,
          isPending: false,
          isMissed: false,
        },
        required: true,
        attributes: ['startDate'],
      },
    ],
    attributes: ['id', 'createdAt', 'isConfirmed', 'primaryType'],
    order: [['createdAt', 'DESC']],
    ...query,
  });
}

export function buildReminderEvent({ data }) {
  return {
    id: Buffer.from(`reminder-${data.id}`).toString('base64'),
    type: 'Reminder',
    metaData: data,
  };
}
