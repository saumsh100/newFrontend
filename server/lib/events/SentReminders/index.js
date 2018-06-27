
import { SentReminder, Event, Appointment } from '../../../_models';

export function fetchSentReminderEvents(patientId, accountId, query) {
  return SentReminder.findAll({
    raw: true,
    where: {
      accountId,
      patientId,
      isSent: true,
    },
    include: [{
      model: Appointment,
      as: 'appointment',
      where: {
        isDeleted: false,
        isCancelled: false,
        isPending: false,
        isMissed: false,
      },
      required: true,
    }],
    ...query,
    order: [['createdAt', 'DESC']],
  }).then((sentReminders) => {
    return sentReminders.map((sentReminder) => {
      const buildData = {
        id: sentReminder.id,
        patientId,
        accountId,
        type: 'Reminder',
        metaData: {
          createdAt: sentReminder.createdAt,
          isConfirmed: sentReminder.isConfirmed,
          primaryType: sentReminder.primaryType,
          appointmentStartDate: sentReminder['appointment.startDate'],
        },
      };

      const ev = Event.build(buildData);
      return ev.get({ plain: true });
    });
  });
}
