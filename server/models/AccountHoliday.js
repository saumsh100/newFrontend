
const DailyScheduleShema = require('./schemas/DailySchedule');
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const AccountHoliday = createModel('AccountHoliday', {
  accountId: type.string().uuid(4).required(),
  date: type.date().required(),
  schedule: DailyScheduleShema,
});

module.exports = AccountHoliday;
