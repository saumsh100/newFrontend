
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import isArray from 'lodash/isArray';
import mapValues from 'lodash/mapValues';
import { mergeDateAndTimeWithZone, getRangeOfDays } from '@carecru/isomorphic';

const moment = extendMoment(Moment);

/**
 * changes the Daily Schedule array to Object
 *
 * @param dailyScheduleArray
 * @returns {object} - daily Schedules.
 */
export function mapDailySchedule(dailyScheduleArray) {
  const dailyScheduleObject = {};

  dailyScheduleArray.forEach((dailySchedule) => {
    dailyScheduleObject[dailySchedule.date] = dailySchedule;
  });

  return dailyScheduleObject;
}

/**
 * takes weeklySchedule and gets the right
 *
 * week to use (if advanced)
 * @param weeklySchedule - for advance
 * @param date - ISOString
 * @returns {weeklySchedule} - model of the weeklySchedule to use
 */
export function getWeeklyScheduleFromAdvanced(weeklySchedule, date) {
  if (!weeklySchedule.isAdvanced) {
    return weeklySchedule;
  }

  const week =
    moment(date).diff(weeklySchedule.startDate, 'week') %
    (weeklySchedule.weeklySchedules.length + 1);
  if (week > 0) {
    return weeklySchedule.weeklySchedules[week - 1];
  }

  return weeklySchedule;
}

/**
 * gets the day of week from a ISOString with respect
 * to the timezone given
 *
 * @param date - ISOString
 * @param timezone - the timezone as a string
 * @returns {string} - the day of the week (lowercase)
 */
export function getDayofWeek(date, timezone) {
  return timezone
    ? moment
      .tz(date, timezone)
      .format('dddd')
      .toLowerCase()
    : moment(date)
      .format('dddd')
      .toLowerCase();
}

/**
 * Takes the startDate, endDate, and Timezone into account and computes the daily
 * Schedule from the data
 * eg of result: for April 2nd 2018:
 * { '2018-04-02':
 *      { breaks: [{
 *        startTime: '2018-04-02T17:00:00.000Z',
 *         endTime: '2018-04-02T18:00:00.000Z'
 *         }],
 *        startTime: '2018-04-02T16:00:00.000Z',
 *        chairIds: [],
 *        isClosed: false,
 *        endTime: '2018-04-02T23:00:00.000Z',
 *        pmsScheduleId: null } }
 *
 * @param weeklySchedule - object
 * @param dailySchedules - array
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - the timezone as a string
 * @returns {object} - object of dailySchedule with the date as key
 */
export default function produceDailySchedules(
  weeklySchedule,
  dailySchedules,
  startDate,
  endDate,
  timezone,
) {
  const dailyScheduleObject = mapDailySchedule(dailySchedules);

  const dailySchedulesMap = {};
  const days = getRangeOfDays(startDate, endDate, timezone);
  for (const day of days) {
    const dailySchedule = dailyScheduleObject[day];
    if (dailySchedule) {
      dailySchedule.isDailySchedule = true;
      dailySchedulesMap[day] = dailySchedule;
    } else if (weeklySchedule) {
      const currentWeeklySchedule = getWeeklyScheduleFromAdvanced(weeklySchedule, day);
      const dayOfWeek = getDayofWeek(day, timezone);
      const currentDailySchedule = currentWeeklySchedule[dayOfWeek];

      // Don't add a day if the default weeklySchedule doesn't have one
      if (!currentDailySchedule) continue;

      currentDailySchedule.isDailySchedule = false;
      dailySchedulesMap[day] = currentDailySchedule;
    }
  }

  // cloning the dailySchedule because from above the reference to
  // startTime for two different days can be the same if
  // the startTime came from the weeklySchedule
  return mapValues(dailySchedulesMap, (value, key) => {
    const newValue = Object.assign({}, value);
    newValue.isClosed = !!newValue.isClosed;
    newValue.startTime = mergeDateAndTimeWithZone(key, value.startTime, timezone);
    newValue.endTime = mergeDateAndTimeWithZone(key, value.endTime, timezone);
    newValue.breaks = isArray(value.breaks)
      ? value.breaks.map(b => ({
        startTime: mergeDateAndTimeWithZone(key, b.startTime, timezone),
        endTime: mergeDateAndTimeWithZone(key, b.endTime, timezone),
      }))
      : [];

    return newValue;
  });
}
