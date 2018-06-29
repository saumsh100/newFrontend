/**
 * Check if the typeof the values are the same,
 * if they are not throw a new Error.
 *
 * @param {any} a
 * @param {any} b
 */
const typeofComparison = (a, b) => {
  if (typeof a === typeof b) return true;
  throw new Error(`The typeof the value '${a}' is different than the value '${b}', make sure that the array contains only equal type values`);
};

export default typeofComparison;
