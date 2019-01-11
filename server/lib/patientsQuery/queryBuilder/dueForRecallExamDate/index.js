
import dateType, { BETWEEN } from '../../../queryBuilder/dateType';

/**
 * builds a query object for sequelize query based on dueForRecallExamDate field of
 * the Patient model.
 * @param dates string[]
 * @returns {{where: {dueForRecallExamDate: {$between: *[]}}}}
 */
export default function dueForRecallExamDateQuery(dates) {
  const queryBuilder = dateType(query => ({ where: { dueForRecallExamDate: query } }));
  return queryBuilder(dates, BETWEEN);
}
