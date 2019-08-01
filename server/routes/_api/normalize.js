
const normalizr = require('normalizr');

const { schema } = normalizr;

const noopSchema = () => new schema.Entity('noop', {});

const accountSchema = () => new schema.Entity('accounts', {
  users: [userSchema()],
  practitioners: [_practitionerSchema],
  services: [_serviceSchema],
  weeklySchedule: weeklyScheduleSchema(),
  address: addressSchema(),
});

const addressSchema = () => new schema.Entity('addresses');

const appointmentSchema = () => new schema.Entity('appointments', {
  patient: patientSchema(),
  service: serviceSchema(),
  practitioner: practitionerSchema(),
});

const callSchema = () => new schema.Entity('calls', { patient: patientSchema() });

const chairSchema = () => new schema.Entity('chairs');

const dailyScheduleSchema = () => new schema.Entity('dailySchedules');

const enterpriseSchema = () =>
  new schema.Entity('enterprises');

const eventsSchema = () => new schema.Entity('events');

const chatSchema = () => new schema.Entity('chats', {
  assignEntity: (output, key, value) => {
    if (key === 'lastTextMessage') {
      output.textMessages.push(value);
      delete output.lastTextMessage;
    } else {
      output[key] = value;
    }
  },
  account: accountSchema(),
  patient: patientSchema(),
  textMessages: [textMessageSchema()],
  lastTextMessage: textMessageSchema(),
});

const unreadChatSchema = () => new schema.Entity('chats', {
  account: accountSchema(),
  patient: patientSchema(),
});

const patientSingleSchema = () => new schema.Entity('patient');

const patientSchema = () => new schema.Entity('patients', {
  patientUser: patientUserSchema(),
  chats: [_chatSchema],
});

const familySchema = () => new schema.Entity('families', { patients: [patientSchema()] });

const permissionSchema = () => new schema.Entity('permissions');

const patientUserSchema = () => new schema.Entity('patientUsers');

const requestSchema = () => new schema.Entity('requests', {
  patientUser: patientUserSchema(),
  service: serviceSchema(),
  practitioner: practitionerSchema(),
  chair: chairSchema(),
  requestingPatientUser: patientUserSchema(),
});

const inviteSchema = () => new schema.Entity('invites');

const textMessageSchema = () => new schema.Entity('textMessages');

const userSchema = () => new schema.Entity('users', { permission: permissionSchema() });

const syncClientErrorSchema = () => new schema.Entity('syncClientError');

const weeklyScheduleSchema = () => new schema.Entity('weeklySchedules');

const deliveredProcedureSchema = () => new schema.Entity('deliveredProcedures');

const practitionerSchema = () => new schema.Entity('practitioners', {
  weeklySchedule: weeklyScheduleSchema(),
  services: [_serviceSchema],
  recurringTimeOffs: [practitionerRecurringTimeOffsSchema()],
});

const practitionerRecurringTimeOffsSchema = () => new schema.Entity('practitionerRecurringTimeOffs');

const serviceSchema = () => new schema.Entity('services', { practitioners: [_practitionerSchema] });

const reservationSchema = () => new schema.Entity('reservations');

const waitSpotSchema = () => new schema.Entity('waitSpots', {
  patient: patientSchema(),
  patientUser: patientUserSchema(),
});

const reminderSchema = () => new schema.Entity('reminders');

const recallSchema = () => new schema.Entity('recalls');

const sentReminderSchema = () => new schema.Entity('sentReminders', {
  reminder: reminderSchema(),
  sentReminders: sentReminderPatientsSchema(),
});

const sentReminderPatientsSchema = () => new schema.Entity('sentReminderPatients', {
  appointment: appointmentSchema(),
  patient: patientSchema(),
});

const sentRecallSchema = () => new schema.Entity('sentRecalls', {
  recall: recallSchema(),
  patient: patientSchema(),
});

const patientRecallSchema = () => new schema.Entity('patientRecalls');

var _practitionerSchema = practitionerSchema();
var _serviceSchema = serviceSchema();
var _chatSchema = chatSchema();

const SCHEMAS = {
  // Models (singleFetch/findOne)
  account: accountSchema(),
  address: addressSchema(),
  appointment: appointmentSchema(),
  call: callSchema(),
  chair: chairSchema(),
  dailySchedule: dailyScheduleSchema(),
  enterprise: enterpriseSchema(),
  event: eventsSchema(),
  chat: chatSchema(),
  invite: inviteSchema(),
  patient: patientSchema(),
  family: familySchema(),
  deliveredProcedure: deliveredProcedureSchema(),
  request: requestSchema(),
  service: serviceSchema(),
  textMessage: textMessageSchema(),
  user: userSchema(),
  patientRecall: patientRecallSchema(),
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
  sentReminderPatients: sentReminderPatientsSchema(),
  sentRecall: sentRecallSchema(),
  // Collections (list/find)
  accounts: [accountSchema()],
  addresses: [addressSchema()],
  appointments: [appointmentSchema()],
  calls: [callSchema()],
  chairs: [chairSchema()],
  chats: [chatSchema()],
  unreadChats: [unreadChatSchema()],
  deliveredProcedures: [deliveredProcedureSchema()],
  dailySchedules: [dailyScheduleSchema()],
  enterprises: [enterpriseSchema()],
  events: [eventsSchema()],
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
  patientRecalls: [patientRecallSchema()],
  permissions: [permissionSchema()],
  practitioners: [practitionerSchema()],
  practitionerRecurringTimeOffs: [practitionerRecurringTimeOffsSchema()],
  waitSpots: [waitSpotSchema()],
  weeklySchedules: [weeklyScheduleSchema()],
  reservations: [reservationSchema()],
  sentReminders: [sentReminderSchema()],
  sentRecalls: [sentRecallSchema()],

  // Adding a no operation schema so that we always have a default schema to parse empty responses
  noop: [noopSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
