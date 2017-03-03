
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Request = createModel('Reservation', {
  startTime: type.date().required(),
  endTime: type.date(),
  accountId: type.string().uuid(4),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4).required(),
});

module.exports = Request;
