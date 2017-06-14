
const normalizr = require('normalizr');

const schema = normalizr.schema;

const accountSchema = () => {
  return new schema.Entity('accounts', {
    users: [userSchema()],
    practitioners: [_practitionerSchema],
    services: [_serviceSchema],
    weeklySchedule: weeklyScheduleSchema(),
  });
};

const appointmentSchema = () => {
  return new schema.Entity('appointments', {
    patient: patientSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
  });
};

const chairSchema = () => {
  return new schema.Entity('chairs');
};

const enterpriseSchema = () =>
  new schema.Entity('enterprises');

const chatSchema = () => {
  return new schema.Entity('chats', {
    account: accountSchema(),
    patient: patientSchema(),
    textMessages: [textMessageSchema()],
  });
};

const patientSingleSchema = () => {
  return new schema.Entity('patient');
};

const patientSchema = () => {
  return new schema.Entity('patients', {
    patientUser: patientUserSchema(),
  });
};

const familySchema = () => {
  return new schema.Entity('families', {
    patients: [patientSchema()],
  });
};

const permissionSchema = () => {
  return new schema.Entity('permissions', {
    users: [userSchema()],
  });
};

const patientUserSchema = () => {
  return new schema.Entity('patientUsers')
}

const requestSchema = () => {
  return new schema.Entity('requests', {
    service: serviceSchema(),
    practitioner: practitionerSchema(),
    chair: chairSchema(),
    patientUser: patientUserSchema(),
  });
};

const inviteSchema = () => {
  return new schema.Entity('invites');
};

const textMessageSchema = () => {
  return new schema.Entity('textMessages');
};

const userSchema = () => {
  return new schema.Entity('users');
};

const syncClientErrorSchema = () => {
  return new schema.Entity('syncClientError');
};

const weeklyScheduleSchema = () => {
  return new schema.Entity('weeklySchedules');
};

const practitionerSchema = () => {
  return new schema.Entity('practitioners', {
    weeklySchedule: weeklyScheduleSchema(),
    services: [_serviceSchema],
    timeOffs: [_timeOffSchema],
  });
};

const serviceSchema = () => {
  return new schema.Entity('services', {
    practitioners: [_practitionerSchema],
  });
};

const reservationSchema = () => {
  return new schema.Entity('reservations');
};

const timeOffSchema = () => {
  return new schema.Entity('timeOffs');
};

const waitSpotSchema = () => {
  return new schema.Entity('waitSpots', {
    patient: patientSchema(),
  });
};

const reminderSchema = () => {
  return new schema.Entity('reminders');
};

const recallSchema = () => {
  return new schema.Entity('recalls');
};

const sentReminderSchema = () => {
  return new schema.Entity('sentReminders', {
    appointment: appointmentSchema(),
    reminder: reminderSchema(),
    patient: patientSchema(),
  });
};

const sentRecallSchema = () => {
  return new schema.Entity('sentRecalls', {
    recall: recallSchema(),
    patient: patientSchema(),
  });
};

var _practitionerSchema = practitionerSchema();
var _serviceSchema = serviceSchema();
var _timeOffSchema = timeOffSchema();

const SCHEMAS = {
  // Models (singleFetch/findOne)
  account: accountSchema(),
  appointment: appointmentSchema(),
  chair: chairSchema(),
  enterprise: enterpriseSchema(),
  chat: chatSchema(),
  invite: inviteSchema(),
  patient: patientSchema(),
  family: familySchema(),
  request: requestSchema(),
  service: serviceSchema(),
  textMessage: textMessageSchema(),
  user: userSchema(),
  permission: permissionSchema(),
  practitioner: practitionerSchema(),
  practitionerTimeOff: timeOffSchema(),
  syncClientError: syncClientErrorSchema(),
  reservation: reservationSchema(),
  waitSpot: waitSpotSchema(),
  weeklySchedule: weeklyScheduleSchema(),
  sentReminder: sentReminderSchema(),
  sentRecall: sentRecallSchema(),
  patientUser: patientUserSchema(),
  // Collections (list/find)
  accounts: [accountSchema()],
  patientUsers: [patientUserSchema()],
  appointments: [appointmentSchema()],
  chairs: [chairSchema()],
  chats: [chatSchema()],
  enterprises: [enterpriseSchema()],
  invites: [inviteSchema()],
  patients: [patientSchema()],
  families: [familySchema()],
  requests: [requestSchema()],
  services: [serviceSchema()],
  textMessages: [textMessageSchema()],
  users: [userSchema()],
  syncClientErrors: [syncClientErrorSchema()],
  permissions: [permissionSchema()],
  practitioners: [practitionerSchema()],
  practitionerTimeOffs: [timeOffSchema()],
  waitSpots: [waitSpotSchema()],
  weeklySchedules: [weeklyScheduleSchema()],
  reservations: [reservationSchema()],
  sentReminders: [sentReminderSchema()],
  sentRecalls: [sentRecallSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
