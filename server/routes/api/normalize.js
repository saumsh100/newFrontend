
const normalizr = require('normalizr');

const schema = normalizr.schema;

const appointmentSchema = () => {
  return new schema.Entity('appointments', {
    patient: patientSchema(),
    service: serviceSchema(),
    practitioner: practitionerSchema(),
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

const SCHEMAS = {
  // Models (singleFetch/findOne)
  appointment: appointmentSchema(),
  patient: patientSchema(),
  request: requestSchema(),
  service: serviceSchema(),

  // Collections (list/find)
  appointments: [appointmentSchema()],
  patients: [patientSchema()],
  requests: [requestSchema()],
  services: [serviceSchema()],
};

module.exports = function normalize(key, data) {
  return normalizr.normalize(data, SCHEMAS[key]);
};
