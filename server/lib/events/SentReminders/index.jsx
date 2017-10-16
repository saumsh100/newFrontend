import { SentReminder } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchSentReminderEvents(patientId) {
  return SentReminder.findAll({
    raw: true,
    where: {
      patientId,
    },
    order: [['createdAt', 'ASC']],
  });
}
