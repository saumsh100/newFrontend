
import moment from 'moment-timezone';
import Table from 'cli-table';
import map from 'lodash/map';

/**
 * printRange will return a string with a date-range (startDate, endDate)
 * nicely formatted so that its readable according to a timezone
 *
 * @param startDate
 * @param endDate
 * @param tz
 * @return {string}
 */
export function printRange({ startDate, endDate }, tz) {
  const start = moment.tz(startDate, tz).format('YYYY-MM-DD h:mma');
  const end = moment.tz(endDate, tz).format('YYYY-MM-DD h:mma');
  return `${start} to ${end}`;
}

/**
 * printRanges is a function that accepts an array of ranges and will return a
 * table string that when logged provide a better way of viewing the times
 *
 * @param ranges
 * @param timezone
 * @param customField
 * @return {string}
 */
export function printRanges(ranges, { timezone, customField }) {
  const rangesTable = new Table({
    style: { compact: true }
  });

  if (!ranges.length) return 'None';

  ranges.forEach((range) => {
    const row = [
      moment.tz(range.startDate, timezone).format('h:mma'),
      moment.tz(range.endDate, timezone).format('h:mma'),
    ];

    if (customField) {
      row.push(customField(range));
    }

    rangesTable.push(row);
  });

  return rangesTable.toString();
}

/**
 * printPractitionerData is a function that accepts practitionerData related to availabilities
 * and will return a string that when logged, yields important re: how the availabilities were calculated
 *
 * @param openingsData
 * @param practitioner
 * @param timezone
 * @return {string}
 */
export function printPractitionerData({ openingsData, ...practitioner }, { timezone }) {
  const { firstName, lastName, isCustomSchedule } = practitioner;

  // convert openingsData to an order array
  const sortedDays = map(openingsData, (data, date) => ({ ...data, date })).sort((a, b) => b.date < a.date);

  const header = new Table({
    head: [`${firstName} ${lastName}     { timezone: '${timezone}', isCustomSchedule: ${isCustomSchedule} }`],
    style: { head: ['yellow'] },
  });

  const daysTable = new Table({
    head: [
      'Date',
      'Day',
      'Status',
      'DS?',
      'TO?',
      'Start Time',
      'End Time',
      'Fillers',
      'Openings',
      'Availabilities',
    ],
    style: { head: ['yellow'] },
  });

  sortedDays.forEach(({ date, fillers, dailySchedule, openings, availabilities }) => {
    const {
      isClosed,
      isDailySchedule,
      isModifiedByTimeOff,
      startTime,
      endTime,
    } = dailySchedule;

    daysTable.push([
      date,
      moment.tz(date, timezone).format('dddd'),
      isClosed ? 'Closed' : 'Open', // remember its displaying if open
      isDailySchedule ? 'Y' : 'N',
      isModifiedByTimeOff ? 'Y' : 'N',
      moment.tz(startTime, timezone).format('h:mma'),
      moment.tz(endTime, timezone).format('h:mma'),
      printRanges(fillers, { timezone, customField: filler => filler.isBreak ? 'Break' : 'Appnt' }),
      printRanges(openings, { timezone }),
      printRanges(availabilities, { timezone }),
    ]);
  });

  return header.toString() + '\n' + daysTable.toString();
}

/**
 * printPractitionersData is a function used to print availabilities data for an
 * array of practitionersData
 *
 * @param practitionersData
 * @param account
 * @return {string}
 */
export function printPractitionersData(practitionersData, account) {
  let str = '';
  for (const practitionerData of practitionersData) {
    str += printPractitionerData(practitionerData, account) + '\n';
  }

  return str;
}
