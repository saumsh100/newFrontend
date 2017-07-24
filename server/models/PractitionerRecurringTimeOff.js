const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PractitionerRecurringTimeOff = createModel('PractitionerRecurringTimeOff', {
  practitionerId: type.string().uuid(4).required(),
  startDate: type.date().required(),
  endDate: type.date().required(),
  startTime: type.string(),
  endTime: type.string(),
  interval: type.number().required(),
  allDay: type.boolean().default(true),
  fromPMS: type.boolean().default(false),
  dayOfWeek: type.string().enum('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').required(),
  note: type.string(),
});

module.exports = PractitionerRecurringTimeOff;
