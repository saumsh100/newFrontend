
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
  Appointment: [
    'accountId',
    'practitionerId',
    'patientId',
    'serviceId',
    'chairId',
    'pmsId',
    'isDeleted',
    'isBookable',
    'startDate',
    'endDate',
    'note',
    'isReminderSent',
    'isPatientConfirmed',
    'isSyncedWithPMS',
    'isCancelled',
    'customBufferTime',
    'mark',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  Chair: [
    'accountId',
    'pmsId',
    'description',
    'name',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  ConnectorVersion: [
    'tag',
    'url',
    'key',
    'secret',
    'filename',
    'path',
    'bucket',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  Family: [
    'accountId',
    'pmsId',
    'headId',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  Patient: [
    'accountId',
    'pmsId',
    'patientUserId',
    'email',
    'firstName',
    'lastName',
    'middleName',
    'phoneNumber',
    'homePhoneNumber',
    'mobilePhoneNumber',
    'workPhoneNumber',
    'otherPhoneNumber',
    'prefContactPhone',
    'gender',
    'prefName',
    'language',
    'address',
    'preferences',
    'type',
    'birthDate',
    'insurance',
    'isDeleted',
    'isSyncedWithPMS',
    'familyId',
    'status',
  ],

  Practitioner: [
    'firstName',
    'pmsId',
    'lastName',
    'type',
    'isActive',
    'isHidden',
    'avatarUrl',
    'isCustomSchedule',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  Service: [
    'name',
    'accountId',
    'duration',
    'bufferTime',
    'unitCost',
    'customCosts',
    'pmsId',
    'isHidden',
    'isDefault',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],
};

/**
 * SERIALIZERS contains all allowable resources for jsonapi serialization*
 */
const SERIALIZERS = {
  appointment: new Serializer('appointment', makeConfig({
    attributes: ModelAttributes.Appointment,
    pluralizeType: false,
  })),

  chair: new Serializer('chair', makeConfig({
    attributes: ModelAttributes.Chair,
    pluralizeType: false,
  })),

  connectorVersion: new Serializer('connectorVersion', makeConfig({
    attributes: ModelAttributes.ConnectorVersion,
    pluralizeType: false,
  })),

  family: new Serializer('family', makeConfig({
    attributes: ModelAttributes.Family,
    pluralizeType: false,
  })),

  patient: new Serializer('patient', makeConfig({
    attributes: ModelAttributes.Patient,
    pluralizeType: false,
  })),

  practitioner: new Serializer('practitioner', makeConfig({
    attributes: ModelAttributes.Practitioner,
    pluralizeType: false,
  })),

  service: new Serializer('service', makeConfig({
    attributes: ModelAttributes.Service,
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
