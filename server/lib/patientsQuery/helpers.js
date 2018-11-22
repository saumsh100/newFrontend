
export function ManualLimitOffset(eventsArray, query) {
  const { limit, offset, order } = query;

  let filterArray = eventsArray;

  if (offset && eventsArray.length > offset) {
    filterArray = filterArray.slice(offset, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}

export function getIds(patients, key) {
  return patients.map(patient => patient[key]);
}

export const patientAttributes = [
  'Patient.id',
  'Patient.firstName',
  'Patient.lastName',
  'Patient.nextApptDate',
  'Patient.nextApptId',
  'Patient.lastApptId',
  'Patient.lastApptDate',
  'Patient.firstApptId',
  'Patient.firstApptDate',
  'Patient.lastHygieneApptId',
  'Patient.lastHygieneDate',
  'Patient.lastRecallApptId',
  'Patient.lastRecallDate',
  'Patient.lastRestorativeDate',
  'Patient.lastRestorativeApptId',
  'Patient.birthDate',
  'Patient.status',
  'Patient.email',
  'Patient.patientUserId',
  'Patient.pmsId',
  'Patient.accountId',
  'Patient.phoneNumber',
  'Patient.homePhoneNumber',
  'Patient.workPhoneNumber',
  'Patient.otherPhoneNumber',
  'Patient.gender',
  'Patient.language',
  'Patient.type',
  'Patient.insuranceInterval',
  'Patient.dueForRecallExamDate',
  'Patient.dueForHygieneDate',
];

/**
 * Patient attribute list used by the new patient search API.
 * @type {string[]}
 */
export const patientAttrs = [
  'id',
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
  'contactMethodNote',
  'birthDate',
  'pmsCreatedAt',
  'insurance',
  'isDeleted',
  'isSyncedWithPms',
  'familyId',
  'status',
  'lastApptId',
  'lastApptDate',
  'lastHygieneDate',
  'lastHygieneApptId',
  'lastRecallDate',
  'lastRecallApptId',
  'dueForRecallExamDate',
  'recallPendingAppointmentId',
  'dueForHygieneDate',
  'hygienePendingAppointmentId',
  'lastRestorativeDate',
  'lastRestorativeApptId',
  'firstApptId',
  'firstApptDate',
  'nextApptId',
  'nextApptDate',
  'insuranceInterval',
  'contCareInterval',
  'avatarUrl',
  'omitReminderIds',
  'omitRecallIds',
  'createdAt',
  'updatedAt',
  'deletedAt',
];
