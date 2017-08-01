
import { WeeklySchedule } from '../../server/_models';
import wipeModel from './wipeModel';

const weeklyScheduleId = '8ce3ba61-60cd-40c6-bc85-c018cabd4a40';
const weeklySchedule = {
  id: weeklyScheduleId,
  accountId: '62954241-3652-4792-bae5-5bfed53d37b7',
  createdAt: '2017-07-19T00:14:30.932Z',
  isAdvanced: false,
};

async function seedTestWeeklySchedules() {
  await wipeModel(WeeklySchedule);
  await WeeklySchedule.create(weeklySchedule);
}

module.exports = {
  weeklyScheduleId,
  weeklySchedule,
  seedTestWeeklySchedules,
};
