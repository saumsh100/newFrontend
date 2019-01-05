
import queryGenerator from '../helpers';
import operators from './operators';
import { relativeAfter, relativeBetween, relativeBefore } from './dateCalculations';

export const AFTER = 'after';
export const BEFORE = 'before';
export const BETWEEN = 'between';
export const RELATIVE_BEFORE = 'beforeRelative';
export const RELATIVE_AFTER = 'afterRelative';
export const RELATIVE_BETWEEN = 'betweenRelative';
export const EQUAL = 'equal';

const generators = {
  [AFTER]: '$gt',
  [BEFORE]: '$lt',
  [BETWEEN]: '$between',
  [EQUAL]: '$eq',
  [RELATIVE_BEFORE]: relativeBefore,
  [RELATIVE_AFTER]: relativeAfter,
  [RELATIVE_BETWEEN]: relativeBetween,
};

/**
* Returns the function with injected query for a given comparator and value.
* @param {function} callback
* @return {function}
*/
const dateTimeType = callback =>
  (value, comparator = BETWEEN) => {
    const query = typeof value === 'object' && !Array.isArray(value)
      ? queryGenerator(value, generators, operators)
      : queryFromGenerator(comparator, value);

    return callback(query);
  };

const queryFromGenerator = (comparator, value) => (typeof generators[comparator] === 'function'
  ? generators[comparator](value)
  : { [generators[comparator]]: value });

export default dateTimeType;
