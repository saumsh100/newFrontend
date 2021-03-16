
import React from 'react';
import { toHumanCommaSeparated, capitalize } from '../../../../util/isomorphic';
import styles from './styles.scss';
import { parseDate } from '../../../library/util/datetime';
import {
  groupTimesPerPeriod,
  dateFormatterFactory,
  createAvailabilitiesFromOpening,
} from '../../../library/util/datetime/helpers';

/**
 * Display the dates selected on the waitlist's steps.
 * If is a regular range display the first and the last day,
 * otherwise display a list of dates.
 */
export const waitlistDates = (week) => {
  if (week.size === 0) {
    return null;
  }

  return week
    .keySeq()
    .toArray()
    .map(capitalize)
    .join(', ');
};

/**
 * Display a linear list of times that were selected from the user on the waitlist's steps.
 */
export const waitlistTimes = (waitSpot, availabilities, timezone) =>
  availabilities
  && waitSpot.get('times').size > 0 && (
    <span>
      {Object.keys(availabilities)
        .reduce(
          handleAvailabilitiesTimes(waitSpot.get('times').toJS(), availabilities, timezone),
          [],
        )
        .map(text => text)}
    </span>
  );

/**
 * Configured formatter for the current account timezone and ha format.
 */
export const formatReviewDatesFactory = dateFormatterFactory('ha');
/**
 * With the provided array of strings,
 * build the text tha will be displayed on the Review's page.
 *
 * @param {array} selected
 */
export const handleAvailabilitiesTimes = (selected, availabilities, timezone) => {
  const formatReviewDates = formatReviewDatesFactory(timezone);
  return (acc, value) => {
    if (value === 'total') {
      return acc;
    }
    // Displays 'All day (starTime - endTime)'
    if (availabilities.total === selected.length) {
      const text = `All day (${formatReviewDates(selected[0])} - ${formatReviewDates(
        selected[selected.length - 1],
      )})`;
      return [
        <span className={styles.block} key={btoa(text)}>
          <strong>{text}</strong>
        </span>,
      ];
    }

    const timeframe = availabilities[value];

    // early return if theres no availabilitis on this time frame
    if (!availabilities[value].length) {
      return acc;
    }

    const timeFrame = capitalize(value);
    // all positive messages are displayed in bold.
    let boldedText = '';
    // normal text
    let text = '';

    if (timeframe.length > 0 && timeframe.every(({ startDate }) => selected.includes(startDate))) {
      // Displays 'Timeframe starTime to endTime'
      const startTimeOnTimeFrame = formatReviewDates(timeframe[0].startDate);
      const endTimeOnTimeFrame = formatReviewDates(timeframe[timeframe.length - 1].startDate);
      boldedText += ` All (${startTimeOnTimeFrame} to ${endTimeOnTimeFrame})`;
    } else {
      // Displays an inline list of dates
      const timesReduced = timeframe.reduce(
        (dates, { startDate }) => {
          if (selected.includes(startDate)) {
            dates.in.push(startDate);
          } else {
            dates.out.push(startDate);
          }
          dates.total += 1;
          return dates;
        },
        {
          in: [],
          out: [],
          total: 0,
        },
      );

      if (timesReduced.in.length > 0) {
        if (timesReduced.in.length > timesReduced.total / 2) {
          const startTimeOnTimeFrame = timesReduced.in[0];
          const endTimeOnTimeFrame = timesReduced.in[timesReduced.in.length - 1];
          /**
           * add this to string
           */
          boldedText = ` ${formatReviewDates(startTimeOnTimeFrame)} to ${formatReviewDates(
            endTimeOnTimeFrame,
          )}`;

          if (timesReduced.out.length > 0) {
            const excludedTimes = timesReduced.out.reduce(
              (but, time) =>
                (time < endTimeOnTimeFrame && time > startTimeOnTimeFrame
                  ? [...but, ...[time]]
                  : but),
              [],
            );

            const excludedText = excludedTimes.length > 0
              ? `but ${excludedTimes
                .map(el => formatReviewDates(el))
                .reduce(toHumanCommaSeparated)}`
              : '';
            text += ` ${excludedText}`;
          }
        } else {
          boldedText = ` ${timesReduced.in
            .map(el => formatReviewDates(el))
            .reduce(toHumanCommaSeparated)}`;
        }
      } else {
        text += ' None';
      }
    }

    // adding the new text line to the previous ones.
    return [
      ...acc,
      ...[
        <span className={styles.block} key={btoa(`${timeFrame}_${text}`)}>
          {`${timeFrame}: `}
          {boldedText.length > 0 && <strong>{boldedText}</strong>}
          {` ${text}`}
        </span>,
      ],
    ];
  };
};

/**
 * Create a new Date object combining today's date, month and year with a provided officeHour date.
 *
 * @param date
 * @param timezone
 * @param today
 * @returns Date
 */
const setTimeForToday = (date, timezone, today = new Date()) =>
  parseDate(date, timezone)
    .set({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      date: today.getDate(),
    })
    .toDate();

/**
 * With the provided dailySchedule normalize the data
 * and return only the hours values.
 *
 * @param timezone
 * @returns {function({startTime?: *, endTime?: *}): {startDate: *, endDate: *}}
 */
const normalizeDateHours = timezone => ({ startTime, endTime }) => ({
  startDate: setTimeForToday(startTime, timezone),
  endDate: setTimeForToday(endTime, timezone),
});

/**
 * Remove any value that does not represent a dailySchedule or a open day,
 * also normalize the dailySchedule object.
 *
 * @param schedule
 * @param timezone
 * @returns {*}
 */
const sanitizeSchedule = (schedule, timezone) =>
  schedule
    .filter(h => h && !h.isClosed && h.endTime !== h.startTime)
    .map(normalizeDateHours(timezone));

/**
 * Get the earliest and the latest hours for a weeklySchedule.
 * @param dates
 * @returns *|{startDate: Date, endDate: Date}
 */
const getStartAndEndDate = dates =>
  dates.reduce(
    (acc, { startDate, endDate }) => ({
      startDate: startDate < acc.startDate ? startDate : acc.startDate,
      endDate: endDate > acc.endDate ? endDate : acc.endDate,
    }),
    dates[0],
  );

/**
 * Group availabilities by period, using the weeklySchedule information
 *
 * @param schedule
 * @param timezone
 * @param duration
 * @returns {availabilities|{morning: Array, afternoon: Array, evening: Array, total: number}}
 */
export const availabilitiesGroupedByPeriod = (schedule, timezone, duration) =>
  createAvailabilitiesFromOpening({
    ...getStartAndEndDate(sanitizeSchedule(schedule, timezone)),
    duration,
    interval: 60,
  }).reduce(groupTimesPerPeriod(timezone), {
    morning: [],
    afternoon: [],
    evening: [],
    total: 0,
  });
