
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Request = createModel('Request', {
  startTime: type.date().required(),
  endTime: type.date().required(),
  note: type.string(),
  appointmentId: type.string().uuid(4),
  patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4).required(),
  chairId:  type.string().uuid(4),
  isCancelled: type.boolean().default(false),
  customBufferTime: type.number().integer(),
  isSplit: type.boolean(),
  splitAppointments: [type.string().uuid(4)],
  isParent: type.boolean(),
});

module.exports = Request;
