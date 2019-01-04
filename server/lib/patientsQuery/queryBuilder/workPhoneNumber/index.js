
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on workPhoneNumber field of the Patient model.
 * @param value
 * @returns {{where: {workPhoneNumber: *}}}
 */
export default function workPhoneNumberQuery(value) {
  const queryBuilder = stringType(query => ({ where: { workPhoneNumber: query } }));
  return queryBuilder(value, STARTS_WITH);
}
