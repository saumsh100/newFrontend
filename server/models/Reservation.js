
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Reservation = createModel('Reservation', {
  startTime: type.date().required(),
  endTime: type.date().required(),
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),
  practitionerId: type.string().uuid(4),
});

module.exports = Reservation;
