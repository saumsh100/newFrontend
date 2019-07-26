
import moment from 'moment-timezone';

const MAX_DAYS_DEFAULT = 5;

/**
 *
 * @param date
 * @return {string}
 */
export function getDayOfWeek(date, timezone) {
  return moment.tz(date, timezone).format('dddd').toLowerCase();
}

/**
 * isOpen is a simple function that will decide of a clinic is open
 * at a given day of the week
 *
 * @param weeklySchedule
 * @param dayOfWeek
 * @return {boolean}
 */
export function isOpen(weeklySchedule, dayOfWeek) {
  return !weeklySchedule[dayOfWeek].isClosed;
}

/**
 * countNextClosedDays is a function that use the weeklySchedule
 * and determine the number of consecutive days that a clinic is closed
 *
 * @param accountId
 * @param startDate
 * @param maxDays
 * @return number (integer)
 */
export default function countNextClosedDays({ weeklySchedule, startDate, maxDays = MAX_DAYS_DEFAULT, timezone }) {
  let count;
  let nextDay = moment(startDate);
  for (count = 0; count < (maxDays - 1); count++) {
    nextDay = nextDay.add(1, 'days');
    const nextDayOfWeek = getDayOfWeek(nextDay, timezone);
    if (isOpen(weeklySchedule, nextDayOfWeek)) {
      return count;
    }
  }

  // Returning count might be confusing
  // count IS maxDays at this point
  return maxDays;
}

/**
 * countConsecutiveClosedDays is a function that will use a map of dailySchedules
 * by their "day" (ie. 2019-10-12) to determine the integer number of consecutively closed days
 * from the beginning
 *
 * @param dailySchedulesMap
 * @returns {number}
 */
export function countConsecutiveClosedDays(dailySchedulesMap) {
  const days = Object.keys(dailySchedulesMap);
  const length = days.length;

  for (let i = 0; i < length; i += 1) {
    if (!dailySchedulesMap[days[i]].isClosed) return i;
  }

  return length;
}
