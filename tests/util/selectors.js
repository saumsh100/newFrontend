
import isArray from 'lodash/isArray';
import toArray from 'lodash/toArray';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

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

export function omitPropertiesFromArray(array, omitProps) {
  return array.map(element => omitProperties(element, omitProps));
}

export function omitPropertiesFromBody(responseBody, omitProps, jsonApi = false) {
  if (jsonApi) {
    return omitPropertiesFromBodyJsonApi(responseBody, omitProps);
  }

  responseBody.entities = mapValues(responseBody.entities, (modelsSet) => {
    return mapValues(modelsSet, model => omitProperties(model, omitProps));
  });

  return responseBody;
}

export function pickPropertiesFromBody(responseBody, pickProps) {
  return {
    ...responseBody,
    entities: mapValues(responseBody.entities, modelsSet =>
      mapValues(modelsSet, model => pick(model, pickProps))),
  };
}

function omitPropertiesFromBodyJsonApi(responseBody, omitProps) {
  let data = responseBody.data;
  if (!data) return responseBody;
  if (isArray(data)) {
    data = data.map(d => omitPropertiesFromData(d, omitProps));
  } else {
    data = omitPropertiesFromData(data, omitProps);
  }

  responseBody.data = data;
  return responseBody;
}

function omitPropertiesFromData(data, omitProps) {
  // a bit hacky for now but it does the job
  data.attributes = omitProperties(data.attributes, omitProps);
  return omitProperties(data, omitProps);
}
