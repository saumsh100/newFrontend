import { SentReminder, Event } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchSentReminderEvents(patientId, accountId) {
  return SentReminder.findAll({
    raw: true,
    where: {
      patientId,
    },
    order: [['createdAt', 'ASC']],
  }).then((sentReminders) => {
    const sentReminderEvents = sentReminders.map((sentReminder) => {
      const buildData = {
        id: sentReminder.id,
        patientId,
        accountId,
        type: 'Reminder',
        metaData: {
          createdAt: sentReminder.createdAt,
          isConfirmed: sentReminder.isConfirmed,
          primaryType: sentReminder.primaryType,
        },
      };

      return Event.build(buildData).get({ plain: true });
    });

    return sentReminderEvents;
  });
}
