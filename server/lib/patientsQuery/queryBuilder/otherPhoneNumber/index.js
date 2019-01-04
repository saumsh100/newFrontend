
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on otherPhoneNumber field of the Patient model.
 * @param value
 * @returns {{where: {otherPhoneNumber: *}}}
 */
export default function otherPhoneNumberQuery(value) {
  const queryBuilder = stringType(query => ({ where: { otherPhoneNumber: query } }));
  return queryBuilder(value, STARTS_WITH);
}
