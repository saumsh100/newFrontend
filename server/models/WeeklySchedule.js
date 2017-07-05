const thinky = require('../config/thinky');
const DailyScheduleShema = require('./schemas/DailySchedule');
const createModel = require('./createModel');
const type = thinky.type;


const WeeklySchedule = createModel('WeeklySchedule', {
  accountId: type.string().uuid(4).required(),
  monday: DailyScheduleShema,
  tuesday: DailyScheduleShema,
  wednesday: DailyScheduleShema,
  thursday: DailyScheduleShema,
  friday: DailyScheduleShema,
  saturday: DailyScheduleShema,
  sunday: DailyScheduleShema,
  startDate: type.date(),
  weeklySchedules: [{
    monday: DailyScheduleShema,
    tuesday: DailyScheduleShema,
    wednesday: DailyScheduleShema,
    thursday: DailyScheduleShema,
    friday: DailyScheduleShema,
    saturday: DailyScheduleShema,
    sunday: DailyScheduleShema,
  }],
  isAdvanced: type.boolean(),
});

module.exports = WeeklySchedule;

