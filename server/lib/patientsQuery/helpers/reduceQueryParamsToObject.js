
import { merge } from '@carecru/isomorphic';
import queryBuilder from '../queryBuilder';

/**
 * reduceQueryParamsToObject
 *
 * takes an object of query params and reduce it to a query object for sequelize
 * @param queryAcc
 * @param key
 * @param value
 * @returns {{attributes: *, having: T[], queryOpts: *}}
 */
export default (queryAcc, [key, value]) => {
  const {
    attributes,
    having,
    ...queryOpts
  } = queryBuilder.get(key, value);

  return {
    attributes: queryAcc.attributes.concat(attributes).filter(a => a),
    having: queryAcc.having.concat(having).filter(h => h),
    queryOpts: merge.all([queryAcc.queryOpts, queryOpts]),
  };
};

/**
 * Default object for reduceQueryParamsToObject
 * @type {{attributes: Array, having: Array, queryOpts: {}}}
 */
export const defaultQueryAccumulator = {
  attributes: [],
  having: [],
  queryOpts: {},
};
