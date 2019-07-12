
import { DailySchedule, WeeklySchedule } from 'CareCruModels';
import { getProperDateWithZone } from '@carecru/isomorphic';
import produceDailySchedules from '../produceDailySchedules';

/**
 * Compute and generate the daily schedule data for a practitioner
 *
 * @param account
 * @param practitioner
 * @param startDate
 * @param endDate
 * @returns dailySchedulesMap { 2018-09-11: { ... }, ... }
 */
export async function generateDailySchedulesForPractitioner({
  account,
  practitioner,
  startDate,
  endDate,
}) {
  const { timezone } = account;
  const { weeklyScheduleId, id } = practitioner;

  const weeklySchedule =
    weeklyScheduleId && (await WeeklySchedule.findByPk(weeklyScheduleId)).get({ plain: true });
  const dailySchedules = (await DailySchedule.findAll({
    where: {
      practitionerId: id,
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
      ...produceDailySchedules(weeklySchedule, dailySchedules, startDate, endDate, timezone),
    },
    isCustomSchedule: !!weeklyScheduleId,
    weeklySchedule,
    dailySchedules,
  };
}
