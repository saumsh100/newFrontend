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
    body: `${type} ${action === 'update' ? 'name' : ''} ${action} success`,
  },
  error: {
    body: `${type} ${action === 'update' ? 'name' : ''} ${action} failed`,
  },
});
