
import toArray from 'lodash/toArray';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

export function getModelsArray(key, responseBody) {
  const { entities } = responseBody;
  const modelsMap = entities[key];
  if (!modelsMap) {
    throw new Error(`${key} key does not exist in this responseBody`);
  }

  return toArray(modelsMap);
}

export function omitProperties(responseBody, omitProps = []) {
  omitProps = omitProps.concat(['updatedAt', 'deletedAt', 'createdAt']);
  responseBody.entities = mapValues(responseBody.entities, (modelsSet) => {
    return mapValues(modelsSet, model => omit(model, omitProps));
  });

  return responseBody;
}
