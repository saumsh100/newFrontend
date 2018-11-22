
import moment from 'moment';
import { DeliveredProcedure, sequelize } from 'CareCruModels';

/**
 * Builds a query object for sequelize query for the production value per Patient.
 * @param minValue
 * @param maxValue
 * @returns {{
 *    attributes: *[][],
 *    include: {
 *      model: *, as: string, where: {entryDate: {gt: string, lt: Date}},
 *      attributes: Array,
 *      duplicating: boolean,
 *      required: boolean
 *    }[],
 *    group: string[],
 *    having: *[]
 *  }}
 */
export default function queryProduction([minValue, maxValue]) {
  return {
    attributes: [
      [
        sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')),
        'totalAmount',
      ],
    ],
    include: [
      {
        model: DeliveredProcedure,
        as: 'deliveredProcedures',
        where: {
          entryDate: {
            gt: moment()
              .subtract(1, 'years')
              .toISOString(),
            lt: new Date(),
          },
        },
        attributes: [],
        duplicating: false,
        required: true,
      },
    ],
    group: ['Patient.id'],
    having: [
      {},
      sequelize.where(sequelize.fn('sum', sequelize.col('totalAmount')), {
        gte: minValue,
        lte: maxValue,
      }),
    ],
  };
}
