
import { sortAsc } from '@carecru/isomorphic';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * @param {string|Date|moment} date
 * @param {string} [format]
 * @param {boolean} [strict]
 * @returns {moment.Moment} A Moment object
 */
export const getDate = (date, format = undefined, strict = false) =>
  (format ? moment(date, format, strict) : moment(date));

/**
 * @param {string} [timezone]
 * @param {boolean} [useLocalTime]
 * @returns {moment.Moment} A Moment object
 */
export const getTodaysDate = (timezone = null, useLocalTime = false) => {
  if (timezone && typeof timezone === 'string') {
    return useLocalTime ? moment().tz(timezone) : moment.utc().tz(timezone);
  }
  if (useLocalTime) {
    return moment();
  }
  return moment.utc();
};

/**
 * @param {string|Date|moment} date
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @param {string} [format]
 * @returns {moment.Moment} A Moment object
 */
export const getUTCDate = (date, timezone = null, strict = false, format = undefined) => {
  const newDate = format ? moment.utc(date, format, strict) : moment.utc(date, strict);

  return timezone && typeof timezone === 'string' ? newDate.tz(timezone) : newDate;
};

/**
 * @param {string|Date|moment} date
 * @returns {Date} A Date object
 */
export const getUTCDateObj = (value) => {
  const { years, months, date, hours } = getUTCDate(value).toObject();
  return new Date(years, months, date, hours);
};

/**
 * @param {string|Date|moment} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {moment.Moment} A Moment object
 */
export const getUTCDateWithFormat = (date, format, timezone = null, strict = false) =>
  getUTCDate(date, timezone, strict, format);

/**
 * @param {string|Date|moment} date
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODate = (date, timezone = null, strict = false) =>
  getUTCDate(date, timezone, strict).toISOString();

/**
 * @param {string|Date|moment} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODateWithFormat = (date, format, timezone = null, strict = false) =>
  getUTCDateWithFormat(date, format, timezone, strict).toISOString();

/**
 * @param {string|Date|moment} date
 * @param {(string|string[])} format
 * @param {string} [timezone]
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {string} A ISO string that represents the date
 */
export const getISODateParsedWithFormat = (date, format, timezone = null, strict = false) =>
  parseDateWithFormat(date, format, timezone, strict).toISOString();

/**
 * @param {string|Date|moment} date
 * @param {string} [timezone]
 * @returns {moment.Moment} A Moment object
 */
export const parseDate = (date, timezone = null) =>
  (timezone ? moment.tz(date, timezone) : getDate(date));

/**
 * @param {string|Date|moment} date
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
 * @param {string|Date|moment} date
 * @param {(string|string[])} format
 * @param {string} timezone
 * @param {boolean} useLocalTime set if it should use the computer timezone or not
 * @returns {string} A string witth date/time in the requested formatr
 */
export const getFormattedDate = (date, format, timezone = null, useLocalTime = false) => {
  const hasTimezone = () => (useLocalTime ? parseDate(date, timezone) : getUTCDate(date, timezone));
  const dateToUse = timezone ? hasTimezone() : getDate(date);
  const DST = checkForDST(date, timezone);
  if (DST === 1 && useLocalTime) {
    dateToUse.subtract('1', 'hours');
  }
  return dateToUse.format(format);
};

/**
 * @param {string|Date|moment} date
 * @param {(string|string[])} format
 * @param {boolean} [strict] strict mode is disabled by default
 * @returns {boolean} check if the date is valid or nor in a given format
 */
export const isDateValid = (date, format = undefined, strict = false) =>
  (format ? getDate(date, format, strict).isValid() : getDate(date, strict).isValid);

/**
 * @param {moment} input
 * @param {moment.unitOfTime.DurationConstructor} [unit]
 * @returns {moment.Duration} moment.Duration
 */
export const getDateDurantion = (input, unit = undefined) =>
  (unit ? moment.duration(input, unit) : moment.duration(input));

/**
 * @global
 * @type {{
 * timeInput: string,
 * hourInterval: number,
 * timezone: string,
 * start: number,
 * end: number,
 * date: Date | string,
 * baseDate: Date | string,
 * timeOnly: boolean,
 * }}
 */
const defaultTimeOptionsParams = {
  timeInput: null,
  hourInterval: 0.5,
  timezone: null,
  start: 5,
  end: 22,
  date: null,
  baseDate: '2020-01-31T12:00:00Z',
  timeOnly: false,
  useISOValue: true,
};
let cachedTimeOptions = null;
const cachedTimeOptionsParams = { ...defaultTimeOptionsParams };

const verifyAgainstCache = (options) => {
  const cachedKeys = Object.keys(cachedTimeOptionsParams);
  let isSameAsCache = true;

  cachedKeys.forEach((key) => {
    if (cachedTimeOptionsParams[key] !== options[key]) {
      isSameAsCache = false;
      cachedTimeOptionsParams[key] = options[key];
    }
  });

  return isSameAsCache;
};

/**
 * Check if should add or substract 1 hour due DST differences
 * @param {string} date
 * @param {string} timezone
 * @returns {string}
 * Returns 0 if no changes are needed;
 * Return 1 if need to add 1 hours;
 * Returns -1 if need to substract 1 hour;
 */
export const checkForDST = (date, timezone) => {
  if (date) {
    const isLocalDST = moment(date).isDST();
    const isSystemDST = getUTCDate(date, timezone).isDST();

    if (isSystemDST && !isLocalDST) return 1;
    if (!isSystemDST && isLocalDST) return -1;
  }
  return 0;
};

/**
 * Fixes the time output based on DST information
 * @param {string} date
 * @param {string} timezone
 * @param {string | number} dateOrDST
 * @returns {string} Return time in the LT format
 */
export const getTimeUsingDST = (date, timezone, dateOrDST) => {
  const DST = typeof dateOrDST === 'number' ? dateOrDST : checkForDST(dateOrDST, timezone);
  const dateUTC = getUTCDate(date, timezone);
  const value = dateUTC.toISOString();
  let label = dateUTC.format('LT');

  if (DST === 1) label = dateUTC.add(1, 'hours').format('LT');
  if (DST === -1) label = dateUTC.subtract(1, 'hours').format('LT');

  return {
    label,
    value,
  };
};

/**
 * Generate an array containing valid time-slots,
 * incrementing the provided amount.
 * @param {defaultTimeOptionsParams} [options]
 * @returns {{value: string, label: string}[]} Returns an array with times on UTC
 */
export const generateTimeOptions = (options) => {
  options = {
    ...defaultTimeOptionsParams,
    ...options,
  };
  const isSameAsCache = verifyAgainstCache(options);
  const { timeInput, hourInterval, timezone, date, baseDate, timeOnly, useISOValue } = options;
  let { start, end } = options;

  if (isSameAsCache && cachedTimeOptions) return cachedTimeOptions;

  const timeOptions = [];
  const increment = hourInterval * 60;

  if (timeInput) {
    const minutes = parseDate(timeInput, timezone).minute();
    const remainder = minutes % increment;
    const label = parseDate(timeInput, timezone).format('LT');
    if (remainder) {
      timeOptions.push({
        value: timeInput,
        label,
      });
    }
  }

  const initialDate = getUTCDate(baseDate, timezone);
  const DST = checkForDST(date, timezone);

  if (DST === 1) {
    start -= 1;
    end -= 1;
  }

  if (DST === -1) {
    start += 1;
    end += 1;
  }

  initialDate.set({
    hours: Math.floor(start),
    minutes: 0,
  });

  for (let currentHour = start; currentHour < end + 1; currentHour += hourInterval) {
    const hour = initialDate.format('HH');
    const minute = initialDate.format('mm');
    const getIso = () => (useISOValue ? initialDate.toISOString() : initialDate.format());
    const value = timeOnly ? initialDate.format('HH:mm:ss.SSS[Z]') : getIso();

    const label = !timeOnly
      ? getTimeUsingDST(initialDate, timezone, DST).label
      : initialDate.format('LT');

    timeOptions.push({
      value,
      label,
      order: `${hour}${minute}`,
    });
    initialDate.add(increment, 'minutes');
  }

  const sortedTimes = [...timeOptions].sort((a, b) => sortAsc(a.order, b.order));
  cachedTimeOptions = sortedTimes;
  return sortedTimes;
};

/**
 * Generate an array containing valid time-slots without ,
 * incrementing the provided amount.
 * @param {{
 * baseDate: string, hourInterval: number, timeOnly: boolean, timezone: string, useISOValue: boolean
 * }} [options]
 * @returns {{value: string, label: string}[]} Returns an array with times on UTC
 */
export const generateTimeBreaks = ({
  baseDate = '1970-01-31T12:00:00Z',
  hourInterval = 0.5,
  timeOnly = true,
  timezone = 'America/Vancouver',
  useISOValue = true,
}) =>
  generateTimeOptions({
    baseDate,
    hourInterval,
    timeOnly,
    timezone,
    useISOValue,
    start: 0,
    end: 23,
  });

/**
 * @param {string|Date|moment} date
 * @param {string} timezone
 * @returns {string} an ISO string representing the Date
 */
export const getFixedDate = (date, timezone) =>
  getUTCDate(getDate(date).format('YYYY-MM-DDTHH:mm:ss.sss'), timezone).toISOString();

/**
 * @param {string|Date|moment} startDate
 * @param {string|Date|moment} endDate
 * @param {string} timezone
 * @param {string} [union] defaults to -
 * @param {string} [useLocalTime] defaults to false (check if date should be parsed or not)
 * @returns {string} a string representing the time (7:00 AM - 8:00 AM)
 */
export const getFormattedTime = (
  startDate,
  endDate,
  timezone,
  union = '-',
  useLocalTime = false,
) => {
  const startHourMinute = getFormattedDate(startDate, 'h:mm A', timezone, useLocalTime);
  const endHourMinute = getFormattedDate(endDate, 'h:mm A', timezone, useLocalTime);
  return `${startHourMinute} ${union} ${endHourMinute}`;
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
      const { average } = newSchedule;
      newSchedule.average.start = average.start > start ? start : average.start;
      newSchedule.average.end = average.end < end ? end : average.end;
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

const sortByOffset = (a, b) =>
  (a.offset === b.offset ? a.name.localeCompare(b.name) : b.offset - a.offset);

const getOffsetFromTimezoneName = (name) => {
  const now = Date.now();
  const zone = moment.tz.zone(name);
  return {
    name,
    offset: zone !== null ? zone.utcOffset(now) : 0,
  };
};

const generateDropdownOptionsFromTimezonesWithOffsets = (zone, showAbbr) => {
  const gmtOffset = `GMT${moment.tz(zone.name).format('Z')}`;
  const abbr = showAbbr ? ` - ${moment.tz(zone.name).format('z')}` : '';
  return {
    value: zone.name,
    label: `(${gmtOffset}) ${zone.name.replace(/_/gi, ' ')}${abbr}`,
  };
};

/**
 * @param {{
 * filter: RegExp|false
 * showOffset: boolean
 * showAbbr: boolean
 * }} [options]
 * @returns {{
 * value: string
 * label: string
 * }[]} an array with the list of all desired timezones
 */
export const getTimezoneList = ({
  filter = new RegExp('^America/', 'i'),
  showOffset = false,
  showAbbr = false,
}) => {
  const allZones = moment.tz.names();
  const names = filter ? allZones.filter(name => filter.test(name)) : allZones;

  if (showOffset) {
    return names
      .map(getOffsetFromTimezoneName)
      .sort(sortByOffset)
      .map(zone => generateDropdownOptionsFromTimezonesWithOffsets(zone, showAbbr));
  }
  return names.map(value => ({
    value,
    label: value.replace(/_/gi, ' '),
  }));
};

export const formatTimeToTz = (date, timezone) => {
  const DST = checkForDST(date, timezone);
  const newDate = getUTCDate(date, timezone);

  if (DST === 1 || (DST === 0 && newDate.isDST())) {
    return newDate.subtract('1', 'hours').format('LT');
  }

  return newDate.format('LT');
};

export { moment as DateTimeObj };
