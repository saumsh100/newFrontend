
const normalizr = require('normalizr');

const schema = normalizr.schema;

const accountSchema = () => {
  return new schema.Entity('accounts', {
    users: [userSchema()],
    practitioners: [_practitionerSchema],
    services: [_serviceSchema],
    weeklySchedule: weeklyScheduleSchema(),
    address: addressSchema(),
  });
};

const addressSchema = () => {
  return new schema.Entity('addresses');
};

const appointmentSchema = () => {
  return new schema.Entity('appointments', {
    patient: patientSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
  });
};

const callSchema = () => {
  return new schema.Entity('calls', {
    patient: patientSchema(),
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
  return new schema.Entity('permissions');
};

const patientUserSchema = () => {
  return new schema.Entity('patientUsers')
}

const requestSchema = () => {
  return new schema.Entity('requests', {
    patientUser: patientUserSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
    chair: chairSchema(),
  });
};

const inviteSchema = () => {
  return new schema.Entity('invites');
};

const textMessageSchema = () => {
  return new schema.Entity('textMessages');
};

const userSchema = () => {
  return new schema.Entity('users', {
    permission: permissionSchema(),
  });
};

const syncClientErrorSchema = () => {
  return new schema.Entity('syncClientError');
};

const weeklyScheduleSchema = () => {
  return new schema.Entity('weeklySchedules');
};

const deliveredProcedureSchema = () => {
  return new schema.Entity('deliveredProcedures');
};

const practitionerSchema = () => {
  return new schema.Entity('practitioners', {
    weeklySchedule: weeklyScheduleSchema(),
    services: [_serviceSchema],
    recurringTimeOffs: [practitionerRecurringTimeOffsSchema()],
  });
};

const practitionerRecurringTimeOffsSchema = () => {
  return new schema.Entity('practitionerRecurringTimeOffs');
};

const serviceSchema = () => {
  return new schema.Entity('services', {
    practitioners: [_practitionerSchema],
  });
};

const reservationSchema = () => {
  return new schema.Entity('reservations');
};

const waitSpotSchema = () => {
  return new schema.Entity('waitSpots', {
    patient: patientSchema(),
    patientUser: patientUserSchema(),
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

const SCHEMAS = {
  // Models (singleFetch/findOne)
  account: accountSchema(),
  address: addressSchema(),
  appointment: appointmentSchema(),
  call: callSchema(),
  chair: chairSchema(),
  enterprise: enterpriseSchema(),
  chat: chatSchema(),
  invite: inviteSchema(),
  patient: patientSchema(),
  family: familySchema(),
  deliveredProcedure: deliveredProcedureSchema(),
  request: requestSchema(),
  service: serviceSchema(),
  textMessage: textMessageSchema(),
  user: userSchema(),
  patientUser: patientUserSchema(),
  permission: permissionSchema(),
  practitioner: practitionerSchema(),
  practitionerRecurringTimeOff: practitionerRecurringTimeOffsSchema(),
  syncClientError: syncClientErrorSchema(),
  reservation: reservationSchema(),
  reminder: reminderSchema(),
  recall: recallSchema(),
  waitSpot: waitSpotSchema(),
  weeklySchedule: weeklyScheduleSchema(),
  sentReminder: sentReminderSchema(),
  sentRecall: sentRecallSchema(),
  // Collections (list/find)
  accounts: [accountSchema()],
  addresses: [addressSchema()],
  appointments: [appointmentSchema()],
  calls: [callSchema()],
  chairs: [chairSchema()],
  chats: [chatSchema()],
  deliveredProcedures: [deliveredProcedureSchema()],
  enterprises: [enterpriseSchema()],
  invites: [inviteSchema()],
  patients: [patientSchema()],
  patientUsers: [patientUserSchema()],
  families: [familySchema()],
  requests: [requestSchema()],
  services: [serviceSchema()],
  textMessages: [textMessageSchema()],
  users: [userSchema()],
  syncClientErrors: [syncClientErrorSchema()],
  reminders: [reminderSchema()],
  recalls: [recallSchema()],
  permissions: [permissionSchema()],
  practitioners: [practitionerSchema()],
  practitionerRecurringTimeOffs: [practitionerRecurringTimeOffsSchema()],
  waitSpots: [waitSpotSchema()],
  weeklySchedules: [weeklyScheduleSchema()],
  reservations: [reservationSchema()],
  sentReminders: [sentReminderSchema()],
  sentRecalls: [sentRecallSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
