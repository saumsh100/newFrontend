
import dateTimeType, { BETWEEN } from '../../../queryBuilder/dateTimeType';

/**
 * builds a query object for sequelize query based on lastApptDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {lastApptDate: {$between: *[]}}}}
 */
export default function queryLastAppointment(dates) {
  const queryBuilder = dateTimeType(query => ({ where: { lastApptDate: query } }));
  return queryBuilder(dates, BETWEEN);
}
