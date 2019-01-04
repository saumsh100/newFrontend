
import { WeeklySchedule, DailySchedule } from 'CareCruModels';
import wipeModel from './wipeModel';

const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const weeklyScheduleId = '8ce3ba61-60cd-40c6-bc85-c018cabd4a40';
const officeHourId = '3330f60a-ec83-431f-a67e-28142ab43caa';
const mondayId = '8f698c5b-d4a2-4550-a6dc-1942e068d930';
const tuesdayId = '99698c5b-d4a2-4550-a6dc-1942e068d930';
const wednesdayId = '8f568c5b-d4a2-4550-a6dc-1942e068d930';
const thursdayId = '8f687c5b-d4a2-4550-a6dc-1942e068d930';
const fridayId = '8f69145b-d4a2-4550-a6dc-1942e068d930';
const saturdayId = '8f69145b-d4a2-4550-a6dc-1942e0699930';
const sundayId = '8f69000b-d4a2-4550-a6dc-1942e068d930';
const createdAt = '2017-07-19T00:14:30.932Z';
const date = '2019-08-08';
const startTime = '1970-01-31T16:00:00.000Z';
const endTime = '1970-02-01T01:00:00.000Z';

const weeklySchedule = {
  id: weeklyScheduleId,
  accountId,
  createdAt,
  isAdvanced: false,
};

const practitionerWeeklySchedule = {
  id: weeklyScheduleId,
  accountId,
  createdAt,
  mondayId,
  tuesdayId,
  wednesdayId,
  thursdayId,
  fridayId,
  saturdayId,
  sundayId,
  isAdvanced: false,
};

const officeHour = {
  id: officeHourId,
  accountId,
  createdAt,
  isAdvanced: false,
  mondayId,
};

const dailySchedule = {
  date,
  startTime,
  endTime,
  breaks: [],
  createdAt,
  accountId,
};

const mondayDailySchedule = {
  id: mondayId,
  ...dailySchedule,
};

const tuesdayDailySchedule = {
  id: tuesdayId,
  ...dailySchedule,
};

const wednesdayDailySchedule = {
  id: wednesdayId,
  ...dailySchedule,
};

const thursdayDailySchedule = {
  id: thursdayId,
  ...dailySchedule,
};

const fridayDailySchedule = {
  id: fridayId,
  ...dailySchedule,
};

const saturdayDailySchedule = {
  id: saturdayId,
  ...dailySchedule,
};

const sundayDailySchedule = {
  id: sundayId,
  ...dailySchedule,
};

const dailySchedules = [
  mondayDailySchedule,
  tuesdayDailySchedule,
  wednesdayDailySchedule,
  thursdayDailySchedule,
  fridayDailySchedule,
  saturdayDailySchedule,
  sundayDailySchedule,
];

async function seedTestWeeklySchedules() {
  await wipeModel(DailySchedule);
  await wipeModel(WeeklySchedule);
  await WeeklySchedule.create(weeklySchedule);
  await DailySchedule.create(mondayDailySchedule);
  await WeeklySchedule.create(officeHour);
}

async function seedTestFullWeeklySchedules() {
  await wipeModel(DailySchedule);
  await wipeModel(WeeklySchedule);
  await DailySchedule.bulkCreate(dailySchedules);
  await WeeklySchedule.create(practitionerWeeklySchedule);
}

async function wipeTestWeeklySchedules() {
  await wipeModel(WeeklySchedule);
}

async function seedTestOfficeHour() {
  await wipeModel(DailySchedule);
  await wipeModel(WeeklySchedule);
  await DailySchedule.create(mondayDailySchedule);
  await WeeklySchedule.create(officeHour);
}

async function wipeTestOfficeHour() {
  await wipeModel(DailySchedule);
  await wipeModel(WeeklySchedule);
}

module.exports = {
  weeklyScheduleId,
  weeklySchedule,
  officeHour,
  seedTestWeeklySchedules,
  wipeTestWeeklySchedules,
  seedTestOfficeHour,
  wipeTestOfficeHour,
  officeHourId,
  seedTestFullWeeklySchedules,
};
