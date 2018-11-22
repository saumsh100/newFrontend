
import moment from 'moment-timezone';

/**
 * builds a query object for sequelize query for due within segment.
 * @param days quantity of days to look for
 * @returns {
 * { where: {$or: {
 *    dueForHygieneDate: {$not: null, $gte: string, $lt: (*|string|number)},
 *    dueForRecallExamDate: {$not: null, $gte: string, $lt: (*|string|number)}}}}
 * }
 */
export default function dueWithin(days = 60) {
  const currentDate = moment().startOf('day');
  const startDate = currentDate
    .clone()
    .subtract(days, 'day')
    .startOf('day')
    .toISOString();
  const endDate = currentDate.toISOString();
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
