
// TODO: replace this by importing account seeds and pulling
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const chairId = '7f439ff8-c55d-4423-9316-a41240c4d329';
const validAppointmentId = '1beab035-b72c-4f7a-ad73-09465cbf5654';
const invalidAppointmentId = '2beab035-b72c-4f7a-ad73-09465cbf5654';

// Tomorrow at 8 o clock
// const startDate = new Date(2017, 5, 1, 8, 0);

export default [
  /**
   * For tests... leave this alone
   */
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
  // Valid Appointment
  {
    id: validAppointmentId,
    accountId,
    startDate: new Date(2017, 5, 7, 8, 0),
    endDate: new Date(2017, 5, 7, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Valid Test',
  },
  // Invalid Appointment (already past...)
  {
    id: invalidAppointmentId,
    accountId,
    startDate: new Date(2017, 3, 1, 8, 0),
    endDate: new Date(2017, 3, 1, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Invalid Test',
  },

  /**
   * For General testing - not important to tests - can be changed
   */
  {
    accountId,
    startDate: new Date(2017, 5, 9, 8, 0),
    endDate: new Date(2017, 5, 9, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin Thursday Morning',
  },
  {
    accountId,
    startDate: new Date(2017, 5, 10, 8, 0),
    endDate: new Date(2017, 5, 10, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin Friday Morning Appt',
  },
  {
    accountId,
    startDate: new Date(2017, 5, 17, 8, 0),
    endDate: new Date(2017, 5, 17, 9, 0),
    patientId,
    serviceId,
    practitionerId,
    chairId,
    note: 'Justin (21 day)',
  },
];
