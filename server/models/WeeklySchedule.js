
const DailyScheduleShema = require('./schemas/DailySchedule');
const createModel = require('./createModel');

const WeeklySchedule = createModel('WeeklySchedule', {
  monday: DailyScheduleShema,
  tuesday: DailyScheduleShema,
  wednesday: DailyScheduleShema,
  thursday: DailyScheduleShema,
  friday: DailyScheduleShema,
  saturday: DailyScheduleShema,
  sunday: DailyScheduleShema,
});

module.exports = WeeklySchedule;
