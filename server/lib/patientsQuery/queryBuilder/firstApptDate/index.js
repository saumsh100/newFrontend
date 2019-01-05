
import dateTimeType, { BETWEEN } from '../../../queryBuilder/dateTimeType';

/**
 * builds a query object for sequelize query based on firstApptDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {firstApptDate: {$between: *[]}}}}
 */
export default function queryFirstAppointment(dates) {
  const queryBuilder = dateTimeType(query => ({ where: { firstApptDate: query } }));
  return queryBuilder(dates, BETWEEN);
}
