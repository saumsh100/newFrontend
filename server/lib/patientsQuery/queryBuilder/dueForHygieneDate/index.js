
import dateType, { BETWEEN } from '../../../queryBuilder/dateType';

/**
 * builds a query object for sequelize query based on dueForHygieneDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {dueForHygieneDate: {$between: *[]}}}}
 */
export default function dueForHygieneQuery(dates) {
  const queryBuilder = dateType(query => ({ where: { dueForHygieneDate: query } }));
  return queryBuilder(dates, BETWEEN);
}
