
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
 * countNextClosedDays is a function that will fetch weeklySchedule
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

