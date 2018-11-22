
import { Review } from 'CareCruModels';

/**
 * builds a query object for sequelize query for the reviews between dates.
 * @param endDate
 * @param startDate
 * @returns {{
 *    include: {
 *      model: *,
 *      as: string,
 *      required: boolean,
 *      duplicating: boolean,
 *      attributes: Array,
 *      where: {
 *        createdAt: {
 *          $between: *[]
 *        }
 *      }
 *    }[]
 *  }}
 */
export default function queryReviews([endDate, startDate]) {
  return {
    include: [
      {
        model: Review,
        as: 'reviews',
        required: true,
        duplicating: false,
        attributes: [],
        where: { createdAt: { $between: [endDate, startDate] } },
      },
    ],
  };
}
