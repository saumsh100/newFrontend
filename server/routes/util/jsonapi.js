
import { Serializer } from 'jsonapi-serializer';

const makeConfig = (config = {}) => Object.assign(
  {},
  {
    keyForAttribute: 'camelCase',
  },
  config,
);


/**
 * ModelAttributes is the set of all required attrs that we care about
 * sending down
 */
const ModelAttributes = {
  Chair: [
    'accountId',
    'pmsId',
    'description',
    'name',
    'createdAt',
    'updatedAt',
  ],

  Practitioner: [
    'firstName',
    'lastName',
    'type',
    'isActive',
    'isHidden',
    'avatarUrl',
    'isCustomSchedule',
  ],
};

/**
 * SERIALIZERS contains all allowable resources for jsonapi serialization*
 */
const SERIALIZERS = {
  chair: new Serializer('chair', makeConfig({
    attributes: ModelAttributes.Chair,
    pluralizeType: false,
  })),

  chairs: new Serializer('chairs', makeConfig({
    attributes: ModelAttributes.Chair,
  })),

  practitioner: new Serializer('practitioner', makeConfig({
    attributes: ModelAttributes.Practitioner,
    pluralizeType: false,
  })),
};

/**
 * jsonapi() will accept data and properly organize it
 * to meet json api standards
 *
 * @param resourceName - name of entity/type/resource
 * @param data - either array for collection or object for singular
 * @returns jsonApi serialized data
 */
export default function jsonapi(resourceName, data) {
  const serializer = SERIALIZERS[resourceName];
  if (!serializer) {
    throw new Error(`Cannot call jsonapi with unknown resourceName=${resourceName}`);
  }

  return serializer.serialize(data);
};
