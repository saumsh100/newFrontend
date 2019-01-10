
import queryGenerator from '../helpers';
import operators from './operators';
import normalizer from './util';

export const AFTER = 'after';
export const BEFORE = 'before';
export const BETWEEN = 'between';

const generators = {
  [AFTER]: '$gt',
  [BEFORE]: '$lt',
  [BETWEEN]: '$between',
};

/**
* Returns the function with injected query for a given comparator and value.
* @param {function} callback
* @return {function}
*/
const timeType = callback =>
  (value, comparator = BETWEEN) => {
    const normalizedRequest = normalizer(value);
    const query = typeof normalizedRequest === 'object' && !Array.isArray(normalizedRequest)
      ? queryGenerator(normalizedRequest, generators, operators)
      : { [generators[comparator]]: normalizedRequest };

    return callback(query);
  };


export default timeType;
