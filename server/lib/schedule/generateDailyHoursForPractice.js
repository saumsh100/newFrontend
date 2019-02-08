
import { getProperDateWithZone } from '@carecru/isomorphic';
import { DailySchedule, WeeklySchedule } from 'CareCruModels';
import produceDailySchedules from './produceDailySchedules';

export default async function generateDailyHoursForPractice({
  account,
  startDate,
  endDate,
}) {
  const { timezone, weeklyScheduleId, id } = account;

  const weeklySchedule = weeklyScheduleId && (await WeeklySchedule.findByPk(weeklyScheduleId)).get({ plain: true });
  const dailySchedules = (await DailySchedule.findAll({
    where: {
      accountId: id,
      practitionerId: null,
      date: {
        $between: [
          getProperDateWithZone(startDate, timezone),
          getProperDateWithZone(endDate, timezone),
        ],
      },
    },
  })).map(dailySchedule => dailySchedule.get({ plain: true }));

  return {
    schedule: {
      ...produceDailySchedules(
        weeklySchedule,
        dailySchedules,
        startDate,
        endDate,
        timezone,
      ),
    },
    weeklySchedule,
    dailySchedules,
  };
}
