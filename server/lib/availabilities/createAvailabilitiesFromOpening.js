
import moment from 'moment';

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
export default function createAvailabilitiesFromOpening({ startDate, endDate, duration, interval }) {
  const availabilities = [];
  const mStart = moment(startDate);
  const mod = mStart.minutes() % interval;
  const remainder = mod ? interval - mod : mod;

  let start = mStart.add(remainder, 'minutes').seconds(0).milliseconds(0);
  let end = start.clone().add(duration, 'minutes');
  while (end <= endDate) {
    availabilities.push({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    start = start.clone().add(interval, 'minutes');
    end = end.clone().add(interval, 'minutes');
  }

  return availabilities;
}
