
import React from 'react';
import { capitalizeFirstLetter } from '../../../Utils';
import dateFormatterFactory from '../../../../../iso/helpers/dateTimezone/dateFormatterFactory';
import toHumanCommaSeparated from '../../../../../iso/helpers/string/toHumanCommaSeparated';

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
      return [
        <div>
          <strong>
            {`All day (${formatReviewDates(selected[0])} - ${formatReviewDates(selected[selected.length - 1])})`}
          </strong>
        </div>,
      ];
    }

    const timeframe = availabilities[value];

    // early return if theres no availabilitis on this time frame
    if (!availabilities[value].length) {
      return acc;
    }

    const timeFrame = capitalizeFirstLetter(value);
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
          boldedText = ` ${formatReviewDates(startTimeOnTimeFrame)} to ${formatReviewDates(endTimeOnTimeFrame)}`;

          if (timesReduced.out.length > 0) {
            const excludedTimes = timesReduced.out.reduce(
              (but, time) =>
                (time < endTimeOnTimeFrame && time > startTimeOnTimeFrame
                  ? [...but, ...[time]]
                  : but),
              [],
            );

            const excludedText =
              excludedTimes.length > 0
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
        <div>
          {`${timeFrame}: `}
          {boldedText.length > 0 && <strong>{boldedText}</strong>}
          {` ${text}`}
        </div>,
      ],
    ];
  };
};
