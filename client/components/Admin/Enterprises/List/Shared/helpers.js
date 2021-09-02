import orderBy from 'lodash/orderBy';
import { getFormattedDate } from '../../../../library';
import { forEach } from '../../../../library/util/lodash';

export const formattedDate = (date, timezone = null) =>
  getFormattedDate(date, 'MMM DD, YYYY', timezone);

export function getEntities(entities) {
  const data = [];

  forEach(entities, (collectionMap) => {
    forEach(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}

export const getAlertData = (type, action) => ({
  success: {
    body: `${type}${action === 'update' ? ' name' : ''} ${action} success`,
  },
  error: {
    body: `${type}${action === 'update' ? ' name' : ''} ${action} failed`,
  },
});

// Returns the sorted rows by columns name.
export const getSortedRows = (rows, sorted) =>
  orderBy(
    rows, // The collection to iterate over
    sorted.map((sort) => (row) => {
      if (row[sort.id] === null || row[sort.id] === undefined) {
        return -Infinity;
      }
      return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id];
    }), // The iteratees to sort by
    sorted.map((d) => (d.desc ? 'desc' : 'asc')), // The sort orders of iteratees
  );
