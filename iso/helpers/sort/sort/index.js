import sortAsc from '../sortAsc';
import sortDesc from '../sortDesc';

const ASC = 'asc';
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
const sort = (direction = ASC) => (direction.toLowerCase() === ASC ? sortAsc : sortDesc);

export default sort;
