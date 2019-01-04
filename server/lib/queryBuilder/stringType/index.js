
import queryGenerator from '../helpers';
import operators from './operators';

export const CONTAINS = 'contains';
export const STARTS_WITH = 'startsWith';
export const ENDS_WITH = 'endsWith';
export const EQUAL = 'equal';

const generator = {
  [CONTAINS]: word => ({ $iLike: `%${word}%` }),
  [STARTS_WITH]: word => ({ $iLike: `${word}%` }),
  [ENDS_WITH]: word => ({ $iLike: `%${word}` }),
  [EQUAL]: word => ({ $eq: word }),
};

/**
 * Returns the function with injected query for a given comparator and value.
 * @param {function} callback
 * @return {function}
 */
const stringType = callback =>
  (value, comparator = EQUAL) => {
    const query = typeof value === 'object'
      ? queryGenerator(value, generator, operators)
      : queryFromGenerator(comparator, value);

    return callback(query);
  };

const queryFromGenerator = (comparator, value) => (generator[comparator](value));

export default stringType;
