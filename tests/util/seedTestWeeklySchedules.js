
import { WeeklySchedule } from '../../server/_models';
import wipeModel from './wipeModel';

const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const weeklyScheduleId = '8ce3ba61-60cd-40c6-bc85-c018cabd4a40';
const officeHourId = '3330f60a-ec83-431f-a67e-28142ab43caa';
const weeklySchedule = {
  id: weeklyScheduleId,
  accountId,
  createdAt: '2017-07-19T00:14:30.932Z',
  isAdvanced: false,
};
const officeHour = {
  id: officeHourId,
  accountId,
  createdAt: '2017-07-20T00:14:30.932Z',
  isAdvanced: false,
};

async function seedTestWeeklySchedules() {
  await wipeModel(WeeklySchedule);
  await WeeklySchedule.create(weeklySchedule);
}

async function wipeTestWeeklySchedules() {
  await wipeModel(WeeklySchedule);
}

module.exports = {
  weeklyScheduleId,
  weeklySchedule,
  officeHour,
  seedTestWeeklySchedules,
  wipeTestWeeklySchedules,
};
