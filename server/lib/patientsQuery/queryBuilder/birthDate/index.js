
import dateType, { EQUAL } from '../../../queryBuilder/dateType';

/**
 * builds a query object for sequelize query based on birthDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {birthDate: {$between: *[]}}}}
 */
export default function queryBirthDate(date) {
  const queryBuilder = dateType(query => ({ where: { birthDate: query } }));
  return queryBuilder(date, EQUAL);
}
