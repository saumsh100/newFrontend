
import { SentRecall, sequelize } from 'CareCruModels';

/**
 * builds a query object for sequelize query for the last recall sent between two dates.
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
 *      where: {
 *       isSent: boolean
 *      }
 *    }[],
 *    group: string[],
 *    having: *[]
 *  }}
 */
export default function queryLastReminder([endDate, startDate]) {
  return {
    attributes: [
      [
        sequelize.fn('max', sequelize.col('sentRecalls.createdAt')),
        'lastSentRecallDate',
      ],
    ],
    include: [
      {
        model: SentRecall,
        as: 'sentRecalls',
        required: true,
        duplicating: false,
        attributes: [],
        where: { isSent: true },
      },
    ],
    group: ['Patient.id'],
    having: [
      {},
      sequelize.where(
        sequelize.fn('max', sequelize.col('sentRecalls.createdAt')),
        { $between: [endDate, startDate] },
      ),
    ],
  };
}
