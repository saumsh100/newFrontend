
// TODO: replace this by importing account seeds and pulling
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const chairId = '7f439ff8-c55d-4423-9316-a41240c4d329';

// Tomorrow at 8 o clock
// const startDate = new Date(2017, 5, 1, 8, 0);

export default [
  // For tests... leave this alone
  {
    accountId,
    startDate: new Date(2017, 5, 1, 8, 0),
    endDate: new Date(2017, 5, 1, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: '1 day away reminder',
  },

  // For General testing - not important to tests
  {
    accountId,
    startDate: new Date(2017, 5, 2, 8, 0),
    endDate: new Date(2017, 5, 2, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin Friday Appt (1 day)',
  },
  {
    accountId,
    startDate: new Date(2017, 5, 3, 8, 0),
    endDate: new Date(2017, 5, 3, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin Saturday Appt (7 day)',
  },
  {
    accountId,
    startDate: new Date(2017, 5, 17, 8, 0),
    endDate: new Date(2017, 5, 17, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin 16 day away Appt (21 day)',
  },
];
