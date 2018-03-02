
export function ManualLimitOffset(eventsArray, query) {
  const {
    limit,
    offset,
    order,
  } = query;


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
  return patients.map((patient) => {
    return patient[key];
  });
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
];
