/**
 * Evaluates the arguments in order and returns the current value of the first expression
 * that initially does not evaluate to nil value.
 * eg.:
 * @example coalesce(null, false, undefined, 'fourth value');
 * returns 'fourth value' because the forth argument is the first value that is not nil.
 *
 * @param {array} args
 * @return {*} first not nil value from the arguments array, null if none found.
 */
const coalesce = (...args) => args.find(arg =>
  ((arg !== null && arg !== undefined) && (typeof arg !== 'number' || arg.toString() !== 'NaN')));

export default coalesce;
