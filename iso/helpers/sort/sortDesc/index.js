import typeofComparison from '../../errorHandlers/typeofComparison';

/**
 * Sort values using descending order, the values should be the same typeof.
 *
 * @param {any} a
 * @param {any} b
 */
const sortDesc = (a, b) => (typeofComparison(a, b) && a < b ? 1 : -1);

export default sortDesc;
