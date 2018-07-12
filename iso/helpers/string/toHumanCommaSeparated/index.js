/**
 * This reducers joins an array of texts into a single string using
 * commas but the last iteration uses "and"
 * @example
 * [1,2,3]
 * `1, 2 and 3`
 *
 * @param {array} arrayOfText
 */
const toHumanCommaSeparated = (acc, curr, index, arr) => {
  const text = index !== 0 && index === arr.length - 1 ? ' and ' : ', ';
  return `${acc}${text}${curr}`;
};

export default toHumanCommaSeparated;
