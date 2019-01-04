
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on firstName field of the Patient model.
 * @param value
 * @returns {{where: {firstName: *}}}
 */
export default function firstNameQuery(value) {
  const queryBuilder = stringType(query => ({ where: { firstName: query } }));
  return queryBuilder(value, STARTS_WITH);
}
