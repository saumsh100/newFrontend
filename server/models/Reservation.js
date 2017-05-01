
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Reservation = createModel('Reservation', {
  startDate: type.date().required(),
  endDate: type.date().required(),

  // Required relational data
  accountId: type.string().uuid(4).required(),
  serviceId: type.string().uuid(4).required(),

  // Practitioner doesn't have to be selected in Online Booking
  practitionerId: type.string().uuid(4),
});

module.exports = Reservation;
