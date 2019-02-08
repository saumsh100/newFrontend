
import { DailySchedule, WeeklySchedule } from 'CareCruModels';
import { getProperDateWithZone } from '@carecru/isomorphic';
import fetchStaticDataForAvailabilities from '../../availabilities/fetchStaticDataForAvailabilities';
import fetchDynamicDataForAvailabilities from '../../availabilities/fetchDynamicDataForAvailabilities';
import computeOpeningsAndAvailabilities from '../../availabilities/computeOpeningsAndAvailabilities';
import produceDailySchedules from '../produceDailySchedules';

/**
 * Compute and generate the daily schedule data for practitioners.
 *
 * @param accountId
 * @param serviceId
 * @param practitionerId
 * @param startDate
 * @param endDate
 * @returns {Promise<data.practitionersData>}
 */
export default async function generateDailySchedulesForPractitioners({
  accountId,
  serviceId,
  practitionerId,
  startDate,
  endDate,
}) {
  const {
    account,
    service,
    practitioners,
  } = await fetchStaticDataForAvailabilities({
    accountId,
    serviceId,
    practitionerId,
  });

  const {
    account: accountWithData,
    practitioners: practitionersWithData,
    chairs,
  } = await fetchDynamicDataForAvailabilities({
    account,
    practitioners,
    startDate,
    endDate,
  });

  const { practitionersData } = computeOpeningsAndAvailabilities({
    account: accountWithData,
    service,
    practitioners: practitionersWithData,
    chairs,
    startDate,
    endDate,
  });

  return practitionersData;
}

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

  const weeklySchedule = weeklyScheduleId && (await WeeklySchedule.findByPk(weeklyScheduleId)).get({ plain: true });
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
      ...produceDailySchedules(
        weeklySchedule,
        dailySchedules,
        startDate,
        endDate,
        timezone,
      ),
    },
    isCustomSchedule: !!weeklyScheduleId,
    weeklySchedule,
    dailySchedules,
  };
}

