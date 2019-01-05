
import dateTimeType, { BETWEEN } from '../../../queryBuilder/dateTimeType';

/**
 * builds a query object for sequelize query based on nextApptDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {nextApptDate: {$between: *[]}}}}
 */
export default function queryNextAppointment(dates) {
  const queryBuilder = dateTimeType(query => ({ where: { nextApptDate: query } }));
  return queryBuilder(dates, BETWEEN);
}
