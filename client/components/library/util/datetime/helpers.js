
import moment from 'moment-timezone';
import isEqual from 'lodash/isEqual';
import { intervalToNumType } from '../../../../util/isomorphic';
import { getUTCDate, parseDate } from './index';

export { intervalToNumType };
/**
 * Return the start of the current month.
 *
 * @param month {Date}
 * @return {Date}
 */
export const getStartOfTheMonth = month => new Date(month.getFullYear(), month.getMonth(), 1);

/**
 * Return the end of the current month.
 *
 * @param month {Date}
 * @return {Date}
 */
export const getEndOfTheMonth = month => new Date(month.getFullYear(), month.getMonth() + 1, 0);

/**
 * Append the offset to a given date
 * @param date
 * @param offset
 * @param timezone
 */
export const addOffset = (date, offset, timezone = null) => {
  const { num, type } = intervalToNumType(offset);
  return getUTCDate(date, timezone).add(num, type);
};

/**
 * Reducer that groups times in periods,
 * it's a requirement that the default value,
 * is the same as showed below.
 * It will group times using the split times listed above.
 *
 * @param {string} timezone
 * @returns {function} reducer
 */
export const groupTimesPerPeriod = timezone =>
  /**
   * @param previous
   * @param current
   * @param index
   * @returns {{morning: *[]?, afternoon: *[]?, evening: *[]?, total: *}}
   */
  (previous, current, index) => {
    if (
      index === 0
      && !isEqual(previous, {
        afternoon: [],
        evening: [],
        morning: [],
        total: 0,
      })
    ) {
      throw new Error(
        'The default value of your reduce is not valid, you must use the structure showed above.',
      );
    }

    const selectedHour = parseFloat(parseDate(current.startDate, timezone).format('HH'));
    const isAfternoon = selectedHour >= 12 && selectedHour < 17;
    const isEvening = selectedHour >= 17;
    const isMorning = !isAfternoon && !isEvening;

    return {
      ...previous,
      ...(isAfternoon ? { afternoon: [...previous.afternoon, current] } : {}),
      ...(isEvening ? { evening: [...previous.evening, current] } : {}),
      ...(isMorning ? { morning: [...previous.morning, current] } : {}),
      total: previous.total + 1,
    };
  };

export const dateFormatterFactory = format => (timezone = null) => dateTime =>
  parseDate(dateTime, timezone).format(format);

/**
 * convert interval to object
 * @param {string} interval
 */
export const convertIntervalStringToObject = (interval) => {
  const array = interval.split(' ');

  // Defaults to be overridden
  const intervalData = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  let i;
  for (i = 0; i < array.length; i += 2) {
    const quantity = parseFloat(array[i]);
    const type = array[i + 1];
    intervalData[type] = quantity;
  }

  return intervalData;
};

/**
 * convert interval to MS
 * @param {string} interval
 */
export const convertIntervalToMs = interval =>
  moment.duration(convertIntervalStringToObject(interval)).asMilliseconds();

/**
 * createAvailabilitiesFromOpening is a function that will return the open timeslots in a
 * a certain range of time given the duration you want, and the minute interval you want it on
 *
 * @param startDate
 * @param endDate
 * @param duration
 * @param interval
 * @return [availabilities] - an array of date ranges {startDate, endDate}
 */
export const createAvailabilitiesFromOpening = ({ startDate, endDate, duration, interval = 0 }) => {
  if (interval === null) return [];

  const availabilities = [];
  let start = moment(startDate)
    .seconds(0)
    .milliseconds(0);

  if (interval > 0) {
    const mod = start.minutes() % interval;
    const remainder = mod ? interval - mod : mod;
    start.add(remainder, 'minutes');
  }

  let end = start.clone().add(duration, 'minutes');
  const valueToAdd = interval || duration;
  while (end <= endDate) {
    availabilities.push({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    start = start.clone().add(valueToAdd, 'minutes');
    end = end.clone().add(valueToAdd, 'minutes');
  }

  return availabilities;
};

/**
 * Convert a time value into a vertical point.
 *
 * @param {{ time: string, formats: string | string[]}} options
 * @param {string} timezone
 * @param {number} m2px
 * @param {number} baseline
 */
export const timeToVerticalPosition = (options, timezone, m2px = 1, baseline = 0) => {
  const h2m = hoursToConvert => hoursToConvert * 60;
  const { hours, minutes } = moment
    .tz(options.time, options.formats, timezone)
    .subtract(baseline, 'hours')
    .toObject();
  return (minutes + h2m(hours)) * m2px;
};

/**
 * Returns the hours of difference between 2 dates.
 * @param {{ startDate: Date, endDate: Date}} dates
 */
export const getHoursFromInterval = (dates) => {
  const { startDate, endDate } = dates;
  return moment(endDate).diff(startDate, 'hours', true);
};
