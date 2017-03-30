
const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const Appointment = createModel('Appointment', {
  startTime: type.date().required(),
  endTime: type.date().required(),
  note: type.string(),

  // Relations
  patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4).required(),
  chairId: type.string().uuid(4),

  pmsId: type.string(),

  // Lifecycle Attributes
  isPatientConfirmed: type.boolean().default(false),
  isSyncedWithPMS: type.boolean().default(false).required(),
  isCancelled: type.boolean().default(false),

  // Custom buffer time in minutes
  customBufferTime: type.number().integer(),

  // Split Appointments
  isSplit: type.boolean(),
  splitAppointments: [type.string().uuid(4)],
  isParent: type.boolean(),
});

module.exports = Appointment;
