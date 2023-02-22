
'use stric';

/**
 * Format the phone number into the user-friendly format.
 * @param {string} str
 * @return {string}
 */

export const formatPhoneNumber = (str) => {
  if (!str || str[0] !== '+') {
    return str;
  }
  const newStr = str.slice(2, str.length);
  return `(${newStr.slice(0, 3)}) ${newStr.slice(3, 6)}-${newStr.slice(6)}`;
};

/**
 * Sanitize and normalize phone numbers,
 * returning a string with the pattern: "+1 XXX XXX XXXX"
 * @param {string} value
 * @returns {string}
 */

export const normalizePhone = (value) => {
  const onlyNums = value.replace(/(?![+])[^(\d)]|[(|)]/g, '').replace(/(?!^[+])\D/g, '');

  if (/\+\s?([2-9]|0)/g.test(value)) {
    return normalizePhone(`+1${onlyNums.replace(/\+([2-9]|0)/, '')}`);
  }

  if (value.length <= 3) {
    return onlyNums;
  }

  if (onlyNums.length <= 5 && onlyNums.slice(0, 2) === '+1') {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
  }
  if (onlyNums.length <= 5 && onlyNums.slice(0, 2) !== '+1') {
    return `+1 ${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
  }

  if (onlyNums.length <= 8) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5)}`;
  }

  if (onlyNums.length === 10 && onlyNums.slice(0, 2) !== '+1') {
    return `+1 ${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 10)}`;
  }

  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)} ${onlyNums.slice(
    8,
    12,
  )}`;
};

/**
 * Capitalize the first letter of a word or of every word of a sentence.
 * Works without trimming the string.
 *
 * @param {string} str
 * @return {string} capitalized string
 */
export const capitalize = str => str.replace(/\b\w/g, l => l.toUpperCase());

const weekEnds = ['sunday', 'saturday'];
const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const frames = {
  all: 'all',
  weekdays: 'weekdays',
  weekends: 'weekends',
};

export const week = {
  [frames.all]: [weekEnds[0], ...weekDays, weekEnds[1]],
  [frames.weekdays]: weekDays,
  [frames.weekends]: weekEnds,
};

export const dayToFrame = day =>
  (week[frames.weekdays].includes(day) ? frames.weekdays : frames.weekends);

/**
 * Create an array containing the numbers between two values,
 * the default step is 1.
 *
 * Ex: range(2,5), would create the following array [2,3,4,5]
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step
 *
 * @return Array<number>
 */
export const range = (start, end, step = 1) => {
  const mapFn = (_, i) => start + i * step;
  const length = (end - start) / step + 1;
  return Array.from({ length }, mapFn);
};
/**
 * Check if the typeof the values are the same,
 * if they are not throw a new Error.
 *
 * @param {any} a
 * @param {any} b
 */

export const typeofComparison = (a, b) => {
  if (typeof a === typeof b) return true;
  throw new Error(
    `The typeof the value '${a}' is different than the value '${b}', make sure that the array contains only equal type values`,
  );
};

/**
 * Sort values using descending order, the values should be the same typeof.
 *
 * @param {any} a
 * @param {any} b
 */
export const sortDesc = (a, b) => (typeofComparison(a, b) && a < b ? 1 : -1);

/**
 * Sort values using ascending order, the values should be the same typeof.
 *
 * @param {any} a
 * @param {any} b
 */
export const sortAsc = (a, b) => (typeofComparison(a, b) && a > b ? 1 : -1);

/**
 * With the given direction sort the array values,
 * based on the order, which defaults to ascending
 * @example
 * Sorting array of values:
 * ['B', 'C', 'A'].sort(sort()); // ['A', 'B', 'C'];
 * [0, -1, 5].sort(sort('desc')); // [5, 0, -1];
 *
 * Sorting array of objects by property 'id', you can destruct as deep as you want:
 * [{ id: 5 }, { id: 1 }].sort(({ id: a }, { id: b }) => sort()(a, b)); // [{ id: 1 }, { id: 5 }]
 * @param {string} direction
 */
export const sort = (direction = 'asc') => (direction.toLowerCase() === 'asc' ? sortAsc : sortDesc);

/**
 * check if given string is in the email format
 * @param {string} email
 */
export const isValidEmail = (email) => {
  const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegExp.test(email);
};

/**
 * check if given string is in the uuid format
 * @param {string} uuid
 */
export const isValidUUID = (uuid) => {
  const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegExp.test(uuid);
};

/**
 * Check if json string is a valid json that contains only keys from the list of
 * allowed ones.
 * @param {string} jsonString
 * @param {string[]} allowedKeys
 */
export const validateJsonString = (jsonString, allowedKeys) => {
  try {
    const object = JSON.parse(jsonString);
    const keys = Object.keys(object);
    return keys.every(k => allowedKeys.includes(k));
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * Adds the suffix based on number passed.
 * @param {number} i
 */
export const ordinalSuffix = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }

  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }

  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }

  return `${i}th`;
};

/**
 * This reducers joins an array of texts into a single string using
 * commas but the last iteration uses "and"
 * @example
 * [1,2,3]
 * `1, 2 and 3`
 *
 * @param {string} acc
 * @param {string} curr
 * @param {number} index
 * @param {array} arr
 */

export const toHumanCommaSeparated = (acc, curr, index, arr) => {
  const text = index !== 0 && index === arr.length - 1 ? ' and ' : ', ';
  return `${acc}${text}${curr}`;
};

/**
 * Split the interval into value & type format.
 *
 * @param {string} interval
 */
export const intervalToNumType = (interval) => {
  const [num, type] = interval.split(' ');
  return { num,
    type };
};

/**
 * converts separated number and interval type into one string.
 * @param {string | number} num
 * @param {string} type
 */
export const numTypeToInterval = (num, type) => `${num} ${type}`;

export const truncateStr = (str, n) => {
  return str.length > n ? `${str.slice(0, n - 1)}...` : str;
};