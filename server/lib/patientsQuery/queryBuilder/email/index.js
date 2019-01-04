
import stringType, { CONTAINS } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on email field of the Patient model.
 * @param value
 * @returns {{where: {firstName: *}}}
 */
export default function emailQuery(value) {
  const queryBuilder = stringType(query => ({ where: { email: query } }));
  return queryBuilder(value, CONTAINS);
}
