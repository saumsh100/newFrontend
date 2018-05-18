
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';

/**
 * getMostPopularValue is a general utility function that will return the most popular field value
 * for a collection (an array of objects)
 *
 * NOTE: assumes value is a string
 *
 * @param collection - an array of objects
 * @param field - a string that represents a key in the object
 * @return value - most popular value
 */
export default function getMostPopularValue(collection, field) {
  collection = collection.filter(obj => obj[field]);
  if (!collection.length) return null;

  // { [fieldValue1]: [obj1, obj2, ...objN], ... }
  const groupedByField = groupBy(collection, obj => obj[field]);

  // [{ num: 3, value: fieldValue1 }, { num: 5, value: fieldValue2 }, ... ]
  const numbersByField = map(groupedByField, (arr, value) => ({ num: arr.length, value }));

  // [{ num: 5, value: fieldValue }, { num: 3, value: fieldValue1 }, ... ]
  const orderedNums = orderBy(numbersByField, 'num', 'desc');

  // Ensure the value exists
  return orderedNums[0] ? orderedNums[0].value : null;
}
