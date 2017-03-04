
const DailyScheduleShema = require('./schemas/DailySchedule');
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PractitionerHoliday = createModel('PractitionerHoliday', {
  practitionerId: type.string().uuid(4).required(),
  date: type.date().required(),
  schedule: DailyScheduleShema,
});

module.exports = PractitionerHoliday;
