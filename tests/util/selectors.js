
import toArray from 'lodash/toArray';

export function getModelsArray(key, responseBody) {
  const { entities } = responseBody;
  const modelsMap = entities[key];
  if (!modelsMap) {
    throw new Error(`${key} key does not exist in this responseBody`);
  }

  return toArray(modelsMap);
}
