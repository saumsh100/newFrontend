
const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const Appointment = createModel('Appointment', {
  startDate: type.date().required(),
  endDate: type.date().required(),
  note: type.string(),

  // Relations
  patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4).required(),
  chairId: type.string().uuid(4),

  isDeleted: type.boolean().default(false),
  pmsId: type.string(),

  // Lifecycle Attributes
  isReminderSent: type.boolean().default(false),
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

Appointment.ensureIndex('accountId');
Appointment.ensureIndex('accountStart', function (row) {
  return [row('accountId'), row('startDate')];
});

module.exports = Appointment;
