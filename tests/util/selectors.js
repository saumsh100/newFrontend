
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

export function omitProperties(object, omitProps = []) {
  omitProps = omitProps.concat(['updatedAt', 'deletedAt', 'createdAt']);
  return omit(object, omitProps);
}

export function omitPropertiesFromBody(responseBody, omitProps) {
  responseBody.entities = mapValues(responseBody.entities, (modelsSet) => {
    return mapValues(modelsSet, model => omitProperties(model, omitProps));
  });

  return responseBody;
}
