
import { SentReminder, SentRemindersPatients, sequelize } from 'CareCruModels';

const sentReminders = ([sender = null, ...dates]) => ({
  include: [
    {
      model: SentRemindersPatients,
      as: 'sentRemindersPatients',
      required: true,
      duplicating: false,
      attributes: [],
      include: [
        {
          model: SentReminder,
          as: 'sentReminder',
          required: true,
          duplicating: false,
          attributes: [],
          where: {
            createdAt: { $between: dates },
            isSent: true,
            ...(sender === null ? {} : { isAutomated: sender }),
          },
        },
      ],
    },
  ],
});

const queryNotSentReminders = ([sender = null, ...dates]) => ({
  include: [
    {
      model: SentRemindersPatients,
      as: 'sentRemindersPatients',
      required: false,
      duplicating: false,
      attributes: [],
      include: [
        {
          model: SentReminder,
          as: 'sentReminder',
          required: false,
          duplicating: false,
          attributes: [],
          where: {
            createdAt: { $between: dates },
            ...(sender === null ? {} : { isAutomated: sender }),
          },
        },
      ],
    },
  ],
  group: ['Patient.id'],
  having: [
    {},
    sequelize.where(
      sequelize.literal(
        'count(CASE WHEN "sentRemindersPatients->sentReminder"."isSent" = true then 1 else NULL END)',
      ),
      { $eq: 0 },
    ),
  ],
});

/**
 * builds a query object for sequelize query for the sent reminders between the dates
 * @param [status, sender, ...[dates]]
 * @returns object sent or not sent reminders query depending on the first item of the params array
 */
export default ([status = true, ...rest]) =>
  (status ? sentReminders(rest) : queryNotSentReminders(rest));
