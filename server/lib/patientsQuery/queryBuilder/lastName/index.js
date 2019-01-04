
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on lastName field of the Patient model.
 * @param value
 * @returns {{where: {lastName: *}}}
 */
export default function lastNameQuery(value) {
  const queryBuilder = stringType(query => ({ where: { lastName: query } }));
  return queryBuilder(value, STARTS_WITH);
}
