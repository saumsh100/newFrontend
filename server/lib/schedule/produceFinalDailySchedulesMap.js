
import produceDailySchedules from './produceDailySchedules';
import produceTimeOffs from './produceTimeOffs';
import modifyDailySchedulesWithTimeOffs from './modifyDailySchedulesWithTimeOffs';

/**
 * produceFinalDailySchedulesMap is a function that will accept the full set of data that
 * relates to scheduling and will produce the finalDailySchedules over the supplied startDate-endDate range
 *
 * @param weeklySchedule
 * @param dailySchedules
 * @param recurringTimeOffs
 * @param startDate
 * @param endDate
 * @param timezone
 * @return {Object} dailySchedulesMap
 */
export default function produceFinalDailySchedulesMap(
  weeklySchedule,
  dailySchedules,
  recurringTimeOffs,
  startDate,
  endDate,
  timezone,
) {
  const dailySchedulesWithoutTimeOffs = produceDailySchedules(
    weeklySchedule,
    dailySchedules,
    startDate,
    endDate,
    timezone,
  );

  const timeOffs = produceTimeOffs(recurringTimeOffs, startDate, endDate);
  return modifyDailySchedulesWithTimeOffs(dailySchedulesWithoutTimeOffs, timeOffs, timezone);
}
