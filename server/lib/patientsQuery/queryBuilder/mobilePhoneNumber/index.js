
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on mobilePhoneNumber field of the Patient model.
 * @param value
 * @returns {{where: {mobilePhoneNumber: *}}}
 */
export default function mobilePhoneNumberQuery(value) {
  const queryBuilder = stringType(query => ({ where: { mobilePhoneNumber: query } }));
  return queryBuilder(value, STARTS_WITH);
}
