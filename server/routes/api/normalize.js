
const normalizr = require('normalizr');

const schema = normalizr.schema;

const accountSchema = () => {
  return new schema.Entity('accounts');
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

const practitionerSchema = () => {
  return new schema.Entity('practitioners');
};

const requestSchema = () => {
  return new schema.Entity('requests', {
    patient: patientSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
  });
};

const serviceSchema = () => {
  return new schema.Entity('services');
};

const textMessageSchema = () => {
  return new schema.Entity('textMessages');
};

const userSchema = () => {
  return new schema.Entity('users');
};

const SCHEMAS = {
  // Models (singleFetch/findOne)
  appointment: appointmentSchema(),
  chair: chairSchema(),
  chat: chatSchema(),
  patient: patientSchema(),
  request: requestSchema(),
  service: serviceSchema(),
  textMessage: textMessageSchema(),
  user: userSchema(),

  // Collections (list/find)
  appointments: [appointmentSchema()],
  chairs: [chairSchema()],
  chats: [chatSchema()],
  patients: [patientSchema()],
  requests: [requestSchema()],
  services: [serviceSchema()],
  textMessages: [textMessageSchema()],
  users: [userSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
