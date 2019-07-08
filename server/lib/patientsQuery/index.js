
import { merge } from '@carecru/isomorphic';
import { Patient } from 'CareCruModels';
import { patientAttrs } from './helpers';
import segments from './segments';
import reduceQueryParamsToObject, {
  defaultQueryAccumulator,
} from './helpers/reduceQueryParamsToObject';
import queryIncludeMerger from './helpers/queryIncludeMerger';

export default async function patientQueryBuilder({
  debug = false,
  page = 0,
  limit = 15,
  order = ['firstName', 'lastName'],
  accountId,
  segment = ['allPatients'],
  status = 'Active',
  ...rest
}) {
  if (!accountId) {
    throw new Error('accountId is required');
  }
  const defaultQuery = {
    where: {
      accountId,
      status,
    },
    include: [],
    limit,
    offset: limit * page,
    order,
    ...(debug && { logging: console.log }),
  };

  const query = Object.entries(rest).reduce(reduceQueryParamsToObject, defaultQueryAccumulator);

  const [segmentName, ...segmentArgs] = segment;
  const { attributes, having, ...segmentOpts } = segmentName
    ? segments[segmentName](...segmentArgs)
    : {};

  const finalHavingArray = query.having.concat(having).filter(h => h);
  const queryObj = {
    attributes: patientAttrs
      .concat(query.attributes)
      .concat(attributes)
      .filter(a => a),
    ...(!!finalHavingArray.length && { having: finalHavingArray }),
    ...merge.all([defaultQuery, segmentOpts, query.queryOpts]),
  };

  const finalQuery = {
    ...queryObj,
    include: queryIncludeMerger(queryObj.include),
  };

  if (debug) console.log(finalQuery);
  return Patient.findAndCountAll(finalQuery);
}
