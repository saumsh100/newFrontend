
import { sortAsc } from '@carecru/isomorphic';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * @param {moment.MomentInput} date
 * @param {string} [format]
 * @param {boolean} [strict]
 * @returns {moment.Moment} A Moment object
 */
export const getDate = (date, format = false, strict = false) =>
  (format ? moment(date, format, strict) : moment(date));

/**
 * @param {string} [timezone]
 * @returns {moment.Moment} A Moment object
 */
export const getTodaysDate = (timezone = null) =>
  (timezone && typeof timezone === 'string' ? moment.utc().tz(timezone) : moment.utc());

/**
 * @param {moment.MomentInput} date
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @param {string} [format]
 * @returns {moment.Moment} A Moment object
 */
export const getUTCDate = (date, timezone = null, strict = false, format = null) => {
  const newDate = format ? moment.utc(date, format, strict) : moment.utc(date, strict);

  return timezone && typeof timezone === 'string' ? newDate.tz(timezone) : newDate;
};

/**
 * @param {moment.MomentInput} date
 * @returns {Date} A Date object
 */
export const getUTCDateObj = (value) => {
  const { years, months, date, hours } = getUTCDate(value).toObject();
  return new Date(years, months, date, hours);
};

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {moment.Moment} A Moment object
 */
export const getUTCDateWithFormat = (date, format, timezone = null, strict = false) =>
  getUTCDate(date, timezone, strict, format);

/**
 * @param {moment.MomentInput} date
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODate = (date, timezone = null, strict = false) =>
  getUTCDate(date, timezone, strict).toISOString();

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODateWithFormat = (date, format, timezone = null, strict = false) =>
  getUTCDateWithFormat(date, format, timezone, strict).toISOString();

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODateParsedWithFormat = (date, format, timezone = null, strict = false) =>
  parseDateWithFormat(date, format, timezone, strict).toISOString();

/**
 * @param {moment.MomentInput} date
 * @param {string} [timezone]
 * @returns {moment.Moment} A Moment object
 */
export const parseDate = (date, timezone = null) =>
  (timezone ? moment.tz(date, timezone) : getDate(date));

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {moment.Moment} A Moment object
 */
export const parseDateWithFormat = (date, format, timezone = null, strict = false) =>
  (timezone && typeof timezone === 'string'
    ? moment.tz(date, format, strict, timezone)
    : getDate(date, format, strict));

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {string} timezone
 * @param {boolean} local set if it should use the computer timezone or not
 * @returns {string} A string witth date/time in the requested formatr
 */
export const getFormattedDate = (date, format, timezone = null, local = false) => {
  const hasTimezone = () => (local ? parseDate(date, timezone) : getUTCDate(date, timezone));
  const dateToUse = timezone ? hasTimezone() : getDate(date);
  return dateToUse.format(format);
};

/**
 * @param {moment.MomentInput} date
 * @param {(string|string[])} format
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {boolean} check if the date is valid or nor in a given format
 */
export const isDateValid = (date, format = null, strict = false) =>
  (format ? getDate(date, format, strict).isValid() : getDate(date, strict).isValid);

/**
 * @param {moment.DurationInputArg1} [input]
 * @param {moment.unitOfTime.DurationConstructor} [unit]
 * @returns {moment.Duration} moment.Duration
 */
export const getDateDurantion = (input = undefined, unit = undefined) =>
  moment.duration(input, unit);

/**
 * @typedef GenerateTimeOptionsParams
 * @type {object}
 * @property {string} [timeInput]
 * @property {float} [hourInterval] - e.g 0.5 for 30 min and 0.25 for 15 min
 * @property {string} [timezone]
 * @property {number} [start]
 * @property {number} [end]
 * Generate an array containing valid time-slots,
 * incrementing the provided amount.
 */

/**
 * @param {GenerateTimeOptionsParams} [options]
 * @returns {{value: string, label: string}[]} Returns an array with times on UTC
 */
export const generateTimeOptions = ({
  timeInput = null,
  hourInterval = 0.5,
  timezone = null,
  start = 5,
  end = 23,
  date = null,
} = {}) => {
  const timeOptions = [];
  const increment = hourInterval * 60;

  if (timeInput) {
    const minutes = moment.tz(timeInput, timezone).minute();
    const remainder = minutes % increment;
    const label = moment.tz(timeInput, timezone).format('LT');
    if (remainder) {
      timeOptions.push({
        value: timeInput,
        label,
      });
    }
  }

  const local = moment(date);
  const isDST = date && getUTCDate(date, timezone).isDST() && !local.isDST();
  const initialDate = getUTCDate('1970-01-01T12:00:00Z', timezone);

  if (isDST) {
    start -= 1;
    end -= 1;
  }

  initialDate.set({
    hours: Math.floor(start),
    minutes: 0,
  });

  for (let currentHour = start; currentHour < end + 1; currentHour += hourInterval) {
    const hour = initialDate.format('HH');
    const minute = initialDate.format('mm');
    const value = initialDate.toISOString();

    const label = isDST
      ? getUTCDate(initialDate, timezone)
        .add(1, 'hours')
        .format('LT')
      : initialDate.format('LT');

    timeOptions.push({
      value,
      label,
      order: `${hour}${minute}`,
    });
    initialDate.add(increment, 'minutes');
  }

  const sortedTimes = [...timeOptions].sort((a, b) => sortAsc(a.order, b.order));
  return sortedTimes;
};

/**
 * @param {moment.MomentInput} date
 * @param {string} timezone
 * @returns {string} an ISO string representing the Date
 */
export const getFixedDate = (date, timezone) =>
  getUTCDate(getDate(date).format('YYYY-MM-DDTHH:mm:ss.sss'), timezone).toISOString();

/**
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} timezone
 * @returns {string} a string representing the time (7:00 AM - 8:00 AM)
 */
export const getFormattedTime = (startDate, endDate, timezone) => {
  const startHourMinute = getFormattedDate(startDate, 'h:mm A', timezone);
  const endHourMinute = getFormattedDate(endDate, 'h:mm A', timezone);
  return startHourMinute.concat(' - ', endHourMinute);
};

/**
 * @param {Map} entities
 * @param {Map} auth
 * @returns {WeeklyScheduleShape} an object containg the entire week schedule from office hours
 */
export const getWeeklySchedule = (entities, auth) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
  ]);

  const timezone = auth.get('timezone');
  const newSchedule = {
    week: {
      sunday: { start: 12,
        end: 12,
        day: 0 },
      monday: { start: 12,
        end: 12,
        day: 1 },
      tuesday: { start: 12,
        end: 12,
        day: 2 },
      wednesday: { start: 12,
        end: 12,
        day: 3 },
      thursday: { start: 12,
        end: 12,
        day: 4 },
      friday: { start: 12,
        end: 12,
        day: 5 },
      saturday: { start: 12,
        end: 12,
        day: 6 },
    },
    average: {
      start: 12,
      end: 12,
    },
  };

  Object.keys(newSchedule.week).forEach((key) => {
    const { isClosed, startTime, endTime } = weeklySchedule[key];
    const start = getUTCDate(startTime, timezone).hours();
    const end = getUTCDate(endTime, timezone).hours();

    if (!isClosed) {
      newSchedule.week[key].start = start;
      newSchedule.week[key].end = end;
      newSchedule.average.start =
        newSchedule.average.start > start ? start : newSchedule.average.start;
      newSchedule.average.end = newSchedule.average.end < end ? end : newSchedule.average.end;
    }
  });

  return newSchedule;
};

export const WeeklyScheduleShape = {
  week: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }),
  }),
  average: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }),
};

/**
 * @param {RegExp|false} [filter]
 * @returns {{value:string}[]} an array with the list of all desired timezones
 */
export const getTimezoneList = (filter = /america/gi) => {
  const names = filter ? moment.tz.names().filter(name => filter.test(name)) : moment.tz.names();
  return names.map(value => ({ value }));
};

export { moment as DateTimeObj };
