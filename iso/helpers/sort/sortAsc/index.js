import typeofComparison from '../../errorHandlers/typeofComparison';

/**
 * Sort values using ascending order, the values should be the same typeof.
 *
 * @param {any} a
 * @param {any} b
 */
const sortAsc = (a, b) => (typeofComparison(a, b) && a > b ? 1 : -1);

export default sortAsc;
