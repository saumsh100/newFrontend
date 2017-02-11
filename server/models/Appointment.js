
const thinky = require('../config/thinky');

const type = thinky.type;

const Appointment = thinky.createModel('Appointment', {
  id: type.string().uuid(4),
  title: type.string(),
  startTime: type.date().required(),
  endTime: type.date().required(),
  createdAt: type.date(),
  confirmed: type.boolean().default(false),


  comment: type.string(),

  // Relations
  patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4).required(),
  chairId: type.string().uuid(4),

  // Lifecycle Attributes
  isClinicConfirmed: type.boolean(),
  isPatientConfirmed: type.boolean(),
  isSyncedWithPMS: type.boolean(),
  isCancelled: type.boolean(),

  // Custom buffer time in minutes
  customBufferTime: type.number().integer(),

  // Split Appointments
  isSplit: type.boolean(),
  splitAppointments: [type.string().uuid(4)],
  isParent: type.boolean(),
});

module.exports = Appointment;
