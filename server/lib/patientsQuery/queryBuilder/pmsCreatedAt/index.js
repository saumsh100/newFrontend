
import dateTimeType, { BETWEEN } from '../../../queryBuilder/dateTimeType';

/**
 * builds a query object for sequelize query based on pmsCreatedAt field of the Patient model.
 * @param dates string[]
 * @returns {{where: {pmsCreatedAt: {$between: *[]}}}}
 */
export default function queryPmsCreatedAt(dates) {
  const queryBuilder = dateTimeType(query => ({ where: { pmsCreatedAt: query } }));
  return queryBuilder(dates, BETWEEN);
}
