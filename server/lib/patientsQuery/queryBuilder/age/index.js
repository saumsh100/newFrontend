
import { prepareQueryParams } from './util';
import numberType, { BETWEEN } from '../../../queryBuilder/numberType';

/**
 * builds a query object for sequelize query based on age/birthDate field of the Patient model.
 * @param value string[]
 * @returns {{where: {birthDate: {$between: string[]}}}}
 */
export default function queryAge(value) {
  const queryParams = prepareQueryParams(value);
  const queryBuilder = numberType(query => ({ where: { birthDate: query } }));
  return queryBuilder(queryParams, BETWEEN);
}
