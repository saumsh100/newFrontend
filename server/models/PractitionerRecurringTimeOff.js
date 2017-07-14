const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PractitionerRecurringTimeOff = createModel('PractitionerRecurringTimeOff', {
  practitionerId: type.string().uuid(4).required(),
  startDate: type.date().required(),
  endDate: type.date().required(),
  allDay: type.boolean().default(true),
  note: type.string(),
});

module.exports = PractitionerRecurringTimeOff;
