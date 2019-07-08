
import { SentRecall, sequelize } from 'CareCruModels';

const sentRecalls = ([sender = null, ...dates]) => ({
  include: [
    {
      model: SentRecall,
      as: 'sentRecalls',
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
  group: ['Patient.id'],
});

const notSentRecalls = ([sender = null, ...dates]) => ({
  include: [
    {
      model: SentRecall,
      as: 'sentRecalls',
      required: false,
      duplicating: false,
      attributes: [],
      where: {
        createdAt: { $between: dates },
        ...(sender === null ? {} : { isAutomated: sender }),
      },
    },
  ],
  group: ['Patient.id'],
  having: [
    {},
    sequelize.where(
      sequelize.literal('count(CASE WHEN "sentRecalls"."isSent" = true then 1 else NULL END)'),
      { $eq: 0 },
    ),
  ],
});

/**
 * builds a query object for sequelize query for the sent recalls between the dates
 * @param [status, sender, ...[dates]]
 * @returns object - sent or not sent recalls query depending on the first item of the params array
 */
export default ([status = true, ...rest]) => (status ? sentRecalls(rest) : notSentRecalls(rest));
