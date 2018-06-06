
import moment from 'moment';
import each from 'lodash/each';

export const formatedDate = date => moment(date).format('MMM DD, YYYY');

export function getEntities(entities) {
  const data = [];
  each(entities, (collectionMap) => {
    each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}
