
import { SentReminder, SentRemindersPatients, sequelize } from 'CareCruModels';

/**
 * builds a query object for sequelize query for the last reminder sent between two dates.
 * @param endDate
 * @param startDate
 * @returns {{
 *    attributes: *[][],
 *    include: {
 *      model: *,
 *      as: string,
 *      required: boolean,
 *      duplicating: boolean,
 *      attributes: Array,
 *      include: {
 *        model: *,
 *        as: string,
 *        required: boolean,
 *        duplicating: boolean,
 *        attributes: Array,
 *        where: {
 *          isSent: boolean
 *        }
 *      }[]
 *    }[],
 *    group: string[],
 *    having: *[]
 *  }}
 */
export default function queryLastReminder([endDate, startDate]) {
  return {
    attributes: [
      [
        sequelize.fn('max', sequelize.col('sentRemindersPatients->sentReminder.createdAt')),
        'lastSentReminderDate',
      ],
    ],
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
            where: { isSent: true },
          },
        ],
      },
    ],
    group: ['Patient.id'],
    having: [
      {},
      sequelize.where(
        sequelize.fn('max', sequelize.col('sentRemindersPatients->sentReminder.createdAt')),
        { $between: [endDate, startDate] },
      ),
    ],
  };
}
