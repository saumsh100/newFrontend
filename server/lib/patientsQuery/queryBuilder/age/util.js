
import { setDateToTimezone } from '@carecru/isomorphic';

/**
 * Compose a query-builder-ready parameters
 * @param params
 * @return {*}
 */
export function prepareQueryParams(params) {
  if (Array.isArray(params)) {
    return calculateDatesArray(params);
  }

  const reformattedParameters = Object.entries(params).map(([key, value]) => {
    const formattedValue = Array.isArray(value)
      ? calculateDatesArray(value)
      : calculateDate(value);
    return { [key]: formattedValue };
  });

  return Object.assign(...reformattedParameters);
}

/**
 * Calculate the date difference for an array of years.
 * @param {Array} yearValue
 * @return {string[]}
 */
function calculateDatesArray(yearValue) {
  return yearValue.map(calculateDate).sort();
}

/**
 * Calculate a difference in years, by subtracting the year given as parameters from the
 * current date.
 * @param years
 * @return {string}
 */
export function calculateDate(years) {
  const now = setDateToTimezone()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  return now.subtract(years, 'years').toISOString();
}
