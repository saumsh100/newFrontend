import { SentReminder, Event, Appointment } from '../../../_models';

export function fetchSentReminderEvents(patientId, accountId) {
  return SentReminder.findAll({
    raw: true,
    where: {
      patientId,
    },
    include: [{
      model: Appointment,
      as: 'appointment',
      where: {
        isDeleted: false,
        isCancelled: false,
      },
      required: false,
    }],
    order: [['createdAt', 'ASC']],
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

      return Event.build(buildData).get({ plain: true });
    });
  });
}
