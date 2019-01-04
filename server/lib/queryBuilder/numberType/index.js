
import queryGenerator from '../helpers';
import operators from './operators';

export const GREATER_THAN = 'greaterThan';
export const LESS_THAN = 'lessThan';
export const BETWEEN = 'between';
export const EQUALS = 'equal';

const generators = {
  [GREATER_THAN]: '$gt',
  [LESS_THAN]: '$lt',
  [BETWEEN]: '$between',
  [EQUALS]: '$eq',
};

/**
 * Returns the function with injected query for a given comparator and value.
 * @param {function} callback
 * @return {function}
 */
const numberType = callback =>
  (value, comparator = EQUALS) => {
    const query = typeof value === 'object' && !Array.isArray(value)
      ? queryGenerator(value, generators, operators)
      : queryFromGenerator(comparator, value);

    return callback(query);
  };

const queryFromGenerator = (comparator, value) => ({ [generators[comparator]]: value });

export default numberType;
