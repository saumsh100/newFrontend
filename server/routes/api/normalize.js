
const normalizr = require('normalizr');

const schema = normalizr.schema;

const accountSchema = () => {
  return new schema.Entity('accounts', {
    users: [userSchema()],
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


const chatSchema = () => {
  return new schema.Entity('chats', {
    account: accountSchema(),
    patient: patientSchema(),
    textMessages: [textMessageSchema()],
  });
};

const patientSchema = () => {
  return new schema.Entity('patients');
};

const permissionSchema = () => {
  return new schema.Entity('permissions', {
    users: [userSchema()],
  });
};

const requestSchema = () => {
  return new schema.Entity('requests', {
    patient: patientSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
    chair: chairSchema(),
  });
};

const textMessageSchema = () => {
  return new schema.Entity('textMessages');
};

const userSchema = () => {
  return new schema.Entity('users');
};

const syncErrorSchema = () => {
  return new schema.Entity('syncErrors');
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
}

var _practitionerSchema = practitionerSchema();
var _serviceSchema = serviceSchema();
var _timeOffSchema = timeOffSchema();

const SCHEMAS = {
  // Models (singleFetch/findOne)
  account: accountSchema(),
  appointment: appointmentSchema(),
  chair: chairSchema(),
  chat: chatSchema(),
  patient: patientSchema(),
  request: requestSchema(),
  service: serviceSchema(),
  textMessage: textMessageSchema(),
  user: userSchema(),
  practitioner: practitionerSchema(),
  practitionerTimeOff: timeOffSchema(),
  syncError: syncErrorSchema(),
  reservation: reservationSchema(),
  weeklySchedule: weeklyScheduleSchema(),
  // Collections (list/find)
  accounts: [accountSchema()],
  appointments: [appointmentSchema()],
  chairs: [chairSchema()],
  chats: [chatSchema()],
  patients: [patientSchema()],
  requests: [requestSchema()],
  services: [serviceSchema()],
  textMessages: [textMessageSchema()],
  users: [userSchema()],
  syncErrors: [syncErrorSchema()],
  permissions: [permissionSchema()],
  practitioners: [practitionerSchema()],
  practitionerTimeOffs: [timeOffSchema()],
  weeklySchedules: [weeklyScheduleSchema()],
  reservations: [reservationSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
