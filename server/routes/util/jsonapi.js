
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
    'isSyncedWithPms',
    'isCancelled',
    'isShortCancelled',
    'isPending',
    'customBufferTime',
    'mark',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'reason',
    'isPreConfirmed',
    'estimatedRevenue',
    'isRecall',
    'appointmentCodes',
  ],

  Chair: [
    'accountId',
    'pmsId',
    'description',
    'name',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'isActive',
  ],

  Configuration: [
    'name',
    'description',
    'data-type',
    'value',
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

  Correspondence: [
    'accountId',
    'pmsId',
    'patientId',
    'appointmentId',
    'type',
    'pmsType',
    'method',
    'note',
    'isSyncedWithPms',
    'contactedAt',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  DeliveredProcedure: [
    'accountId',
    'patientId',
    'procedureCode',
    'entryDate',
    'pmsId',
    'units',
    'totalAmount',
    'primaryInsuranceAmount',
    'secondaryInsuranceAmount',
    'patientAmount',
    'isCompleted',
    'discountAmount',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  DailySchedule: [
    'pmsId',
    'practitionerId',
    'date',
    'startTime',
    'endTime',
    'breaks',
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
    'insuranceInterval',
    'contCareInterval',
    'isDeleted',
    'pmsCreatedAt',
    'isSyncedWithPms',
    'familyId',
    'status',
  ],

  PatientUser: [
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'createdAt',
    'updatedAt',
    'deletedAt',
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

  Request: [
    'name',
    'accountId',
    'duration',
    'startDate',
    'endDate',
    'suggestedPractitionerId',
    'suggestedChairId',
    'note',
    'pmsId',
    'patientId',
    'patientUser',
    'isHidden',
    'isDeleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],

  PractitionerSchedule: [
    'startDate',
    'endDate',
    'startTime',
    'endTime',
    'interval',
    'allDay',
    'fromPMS',
    'pmsId',
    'dayOfWeek',
    'note',
    'practitionerId',
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

  WeeklySchedule: [
    'startDate',
    'pmsId',
    'isAdvanced',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
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

  configuration: new Serializer('configuration', makeConfig({
    attributes: ModelAttributes.Configuration,
    pluralizeType: false,
  })),

  correspondence: new Serializer('correspondence', makeConfig({
    attributes: ModelAttributes.Correspondence,
    pluralizeType: false,
  })),

  dailySchedule: new Serializer('dailySchedule', makeConfig({
    attributes: ModelAttributes.DailySchedule,
    pluralizeType: false,
  })),

  deliveredProcedure: new Serializer('procedure', makeConfig({
    attributes: ModelAttributes.DeliveredProcedure,
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

  practitionerSchedule: new Serializer('practitionerSchedule', makeConfig({
    attributes: ModelAttributes.PractitionerSchedule,
    pluralizeType: false,
  })),

  request: new Serializer('appointmentRequest', makeConfig({
    attributes: ModelAttributes.Request,
    pluralizeType: false,
    patientUser: {
      attributes: ModelAttributes.PatientUser,
    },
  })),

  weeklySchedule: new Serializer('practitionerWeeklySchedule', makeConfig({
    attributes: ModelAttributes.WeeklySchedule,
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
