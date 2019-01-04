
import stringType, { STARTS_WITH } from '../../../queryBuilder/stringType';

/**
 * builds a query object for sequelize query based on homePhoneNumber field of the Patient model.
 * @param value
 * @returns {{where: {homePhoneNumber: *}}}
 */
export default function homePhoneNumberQuery(value) {
  const queryBuilder = stringType(query => ({ where: { homePhoneNumber: query } }));
  return queryBuilder(value, STARTS_WITH);
}
