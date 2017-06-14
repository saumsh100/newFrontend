
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Request = createModel('Request', {
  startDate: type.date().required(),
  endDate: type.date().required(),
  note: type.string(),

  // Required relational data
 // patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  chairId: type.string().uuid(4),

  // Practitioner doesn't have to be selected in Online Booking
  practitionerId: type.string().uuid(4),

  // Lifecycle Attributes
  isCancelled: type.boolean().default(false),
  appointmentId: type.string().uuid(4),
  patientUserId: type.string().uuid(4),
});

module.exports = Request;
