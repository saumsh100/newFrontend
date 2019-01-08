
// Picks the later time of the two
export const mergeStartTime = (startTimeA, startTimeB) =>
  startTimeA > startTimeB ?
    startTimeA :
    startTimeB;

// Picks the earlier time of the two
export const mergeEndTime = (endTimeA, endTimeB) =>
  endTimeA < endTimeB ?
    endTimeA :
    endTimeB;

// Merge the breaks together, no need to make it complex
export const mergeBreaks = (breaksA = [], breaksB = []) => [...breaksB, ...breaksA];

/**
 * mergeDailySchedules is a function that will do a special merge of two schedules
 * based on A's time-off being a higher priority than B's working schedule.
 *
 * For example: If you want to ensure practitioners cannot work when the office is not opened
 * then you would pass in an office's dailySchedule in as A an a practitioner dailySchedule as B
 *
 * @param dailyScheduleA
 * @param dailyScheduleB
 * @return object - {mergedDailySchedule}
 */
export default function mergeDailySchedules(dailyScheduleA, dailyScheduleB) {
  if (dailyScheduleA.isClosed) {
    return {
      ...dailyScheduleB,
      isClosed: true,
    };
  }

  return {
    ...dailyScheduleB,
    startTime: mergeStartTime(dailyScheduleA.startTime, dailyScheduleB.startTime),
    endTime: mergeEndTime(dailyScheduleA.endTime, dailyScheduleB.endTime),
    breaks: mergeBreaks(dailyScheduleA.breaks, dailyScheduleB.breaks),
  };
}
