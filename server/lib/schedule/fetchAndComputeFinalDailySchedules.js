
import {
  fetchAccountDailySchedules,
  fetchAccountWeeklySchedule,
} from './fetchSchedule';
import produceDailySchedules from './produceDailySchedules';

/**
 * fetchAndComputeFinalDailySchedules is an async function that will fetch
 * an account's default weeklySchedule, as well as its dailySchedule overrides and then
 * compute what the final schedules are in a hashmap with the numerical date of the day
 * as the key (see object structure below)
 *
 * @param accountId - UUID String
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - String (ie. 'America/Edmonton')
 * @return object { [date1]: dailySchedule1, [date2]: dailySchedule2, ...etc }
 */
export default async function fetchAndComputeFinalDailySchedules({
  accountId,
  startDate,
  endDate,
  timezone,
}) {
  const getWeeklySchedule = fetchAccountWeeklySchedule({ accountId });
  const getDailySchedules = fetchAccountDailySchedules({
    accountId,
    startDate,
    endDate,
    timezone,
  });

  const [
    weeklySchedule,
    dailySchedules,
  ] = await Promise.all([
    getWeeklySchedule,
    getDailySchedules,
  ]);

  return produceDailySchedules(
    // Need to make raw objects for the produceDailySchedules to work properly
    weeklySchedule.get({ plain: true }),
    dailySchedules.map(ds => ds.get({ plain: true })),
    startDate,
    endDate,
    timezone,
  );
}
