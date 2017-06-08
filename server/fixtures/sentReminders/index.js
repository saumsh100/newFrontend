
// TODO: replace this by importing account seeds and pulling
// This is the accountId2
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const reminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';
const validAppointmentId = '1beab035-b72c-4f7a-ad73-09465cbf5654';
const invalidAppointmentId = '2beab035-b72c-4f7a-ad73-09465cbf5654';

export default [
  /**
   * getValidSmsReminders test...
   */
  // 21 Day Email
  {
    reminderId,
    accountId,
    patientId,
    appointmentId: validAppointmentId,
    primaryType: 'email',
    lengthSeconds: 21 * 24 * 60 * 60,
  },
  // 8 Day Phone
  {
    reminderId,
    accountId,
    patientId,
    appointmentId: validAppointmentId,
    primaryType: 'phone',
    lengthSeconds: 8 * 24 * 60 * 60,
  },
  // 1 day sms created before
  {
    createdAt: (new Date(2017, 5, 1)).toISOString(),
    reminderId,
    accountId,
    patientId,
    appointmentId: validAppointmentId,
    primaryType: 'sms',
    lengthSeconds: 21 * 24 * 60 * 60,
  },
  // 1 day created after
  {
    createdAt: (new Date(2017, 6, 1)).toISOString(),
    reminderId,
    accountId,
    patientId,
    appointmentId: validAppointmentId,
    primaryType: 'sms',
    lengthSeconds: 24 * 60 * 60,
  },
  // 1 day sms from invalid cancelled appointment
  {
    createdAt: (new Date(2017, 4, 1)).toISOString(),
    reminderId,
    accountId,
    patientId,
    appointmentId: invalidAppointmentId,
    primaryType: 'sms',
    lengthSeconds: 24 * 60 * 60,
  },

];
