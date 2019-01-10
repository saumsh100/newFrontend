
import { setDateToTimezone, nowToIso } from '@carecru/isomorphic';
import { getDayStart, getDayEnd } from '../../../../server/util/time';
import { RELATIVE_BEFORE, RELATIVE_AFTER } from './';

/**
 * normalizeOffset is a function that takes a query type and shifts the offset to positive
 * if the query is relative after or negative if is relative before.
 * @param offset
 * @param comparator
 * @return {string}
 */
export const normalizeOffset = (offset, comparator) =>
  (comparator === RELATIVE_BEFORE ? `-${offset}` : offset);

/**
 * generateQuery sorts an array of dates and wraps it around an sequelize query object.
 * @param dates
 * @return {{$between: *}}
 */
export const generateQuery = dates => ({ $between: dates.sort() });

/**
 * addRelativeTime adds and offset to an date returning the final date on ISO format, default
 * relative date is now
 * @param offset
 * @param date
 * @return {*|string|*|*|number}
 */
export const addRelativeTime = (offset, date = nowToIso()) =>
  setDateToTimezone(date)
    .add(...offset.split(' '))
    .toISOString();

/**
 * calculateSingleOffset calculates and builds the relative date query for a given interval and
 * comparator. Interval value can be either an string if you don't want to override the relative
 * date, which defaults to now, or an object in the format of {interval: string, date: Date}.
 * @param value
 * @param comparator
 * @return {*}
 */
const calculateSingleOffset = (value, comparator) => {
  const normalizedCurrentDate = nowToIso();

  if (typeof value === 'string') {
    return calculateSingleOffset(
      {
        interval: value,
        date: normalizedCurrentDate,
      },
      comparator,
    );
  }

  const { interval, date } = value;

  const normalizedOffset = normalizeOffset(interval, comparator);
  const offSettedDate = addRelativeTime(normalizedOffset, date);
  const [firstInterval, lastInterval] = [offSettedDate, date].sort();

  return ({ $between: [getDayStart(firstInterval), getDayEnd(lastInterval)] });
};
/**
 * calculateRelativeBetween calculates and builds the relative date for queries between two
 * intervals in array format, if an object in the format of {interval: string, date: Date}
 * date will override the relative date that the query will be built for.
 * @param value
 * @return {*}
 */
const calculateRelativeBetween = (value) => {
  const normalizedCurrentDate = nowToIso();

  if (Array.isArray(value)) {
    return calculateRelativeBetween({
      interval: value,
      date: normalizedCurrentDate,
    });
  }

  const {
    interval: [firstInterval, lastInterval],
    date,
  } = value;

  return generateQuery([
    getDayStart(addRelativeTime(normalizeOffset(firstInterval, RELATIVE_BEFORE), date)),
    getDayEnd(addRelativeTime(lastInterval, date)),
  ]);
};

/**
 * generates the default query for date types which translates to within a day
 * @param value
 * @return {{$between: *[]}}
 */
export const equal = value =>
  ({ $between: [getDayStart(value), getDayEnd(value)] });

/**
 * generates the sequelize query object for after date queries
 * @param value
 * @return {{$gt: *}}
 */
export const after = value =>
  ({ $gt: getDayEnd(value) });

/**
 * generates the sequelize query object for before date queries
 * @param value
 * @return {{$lt: *}}
 */
export const before = value =>
  ({ $lt: getDayStart(value) });

/**
 * generates the sequelize query object for between date queries
 * @param value
 * @return {{$between: *[]}}
 */
export const between = (value) => {
  const [firstInterval, lastInterval] = value;
  return { $between: [getDayStart(firstInterval), getDayEnd(lastInterval)] };
};

/**
 * Facade function to generate the sequelize query builder for before relative date.
 * @param value
 * @return {*}
 */
export const relativeBefore = value =>
  calculateSingleOffset(value, RELATIVE_BEFORE);

/**
 * Facade function to generate the sequelize query builder for after relative date.
 * @param value
 * @return {*}
 */
export const relativeAfter = value =>
  calculateSingleOffset(value, RELATIVE_AFTER);

/**
 * Facade function to generate the sequelize query builder for between relative date.
 * @param value
 * @return {*}
 */
export const relativeBetween = value => calculateRelativeBetween(value);
