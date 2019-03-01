
import moment from 'moment';

/**
 * builds a query object for sequelize query for late appointments segment.
 * @param startMonth
 * @param endMonth
 * @returns {
 * { where: {$or: {
 *  dueForHygieneDate: {$not: null, $gte: string, $lt: string},
 *  dueForRecallExamDate: {$not: null, $gte: string, $lt: string}}}}
 *  }
 */
export default function lateAppointments(startMonth = 3, endMonth = 0) {
  const startDate = moment()
    .subtract(startMonth, 'months')
    .toISOString();
  const endDate = moment()
    .subtract(endMonth, 'months')
    .toISOString();

  return {
    where: {
      $or: {
        dueForHygieneDate: {
          $not: null,
          $gte: startDate,
          $lt: endDate,
        },
        dueForRecallExamDate: {
          $not: null,
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
  };
}
