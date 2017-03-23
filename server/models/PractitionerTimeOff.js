
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PractitionerTimeOff = createModel('PractitionerTimeOff', {
  practitionerId: type.string().uuid(4).required(),
  startDate: type.date().required(),
  endDate: type.date().required(),
});

module.exports = PractitionerTimeOff;
