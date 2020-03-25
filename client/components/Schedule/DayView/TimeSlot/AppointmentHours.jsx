
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

/**
 * Function to shorten the time string based on the minutes
 * Can also set the AM/PM indicator
 * @param {string | moment} date
 * @param {bool} addAtoFormat
 */
const shortenTime = (date, addAtoFormat = true) => {
  date = moment(date);
  const aFormat = addAtoFormat ? 'a' : '';

  return date.get('minutes') === 0 ? date.format(`h${aFormat}`) : date.format(`h:mm${aFormat}`);
};

/**
 * Function that builds the correct format to display the times.
 * Supress the AM/PM of the end and start times are the same.
 * @param {string | moment} startDate
 * @param {string | moment} endDate
 */
const buildHoursFormat = (startDate, endDate = null) => {
  startDate = moment(startDate);

  if (!endDate) return shortenTime(startDate);

  endDate = moment(endDate);

  const afternoon = 12;
  const addAtoFormat =
    (startDate.get('hour') >= afternoon && endDate.get('hour') >= afternoon) ||
    (startDate.get('hour') < afternoon && endDate.get('hour') < afternoon);

  return `${shortenTime(startDate, !addAtoFormat)} - ${shortenTime(endDate)}`;
};

/**
 * Builds the final string to display.
 * @param {string | moment} startDate
 * @param {string | moment} endDate
 * @param {bool} inline
 */
const buildHoursString = (startDate, endDate, inline = false) =>
  (inline ? buildHoursFormat(startDate) : buildHoursFormat(startDate, endDate));

/**
 * Hours presenter component
 *
 * @param {date} startDate
 * @param {date} endDate
 * @param {bool} inline - add a comma if true
 */
const AppointmentHours = ({ startDate, endDate, inline = false }) => (
  <span className={styles.nameContainer_hours}>
    {inline && ','} {buildHoursString(startDate, endDate, inline)}
  </span>
);

AppointmentHours.propTypes = {
  style: PropTypes.shape({ nameContainer_hours: PropTypes.string }),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  inline: PropTypes.bool,
};

export default AppointmentHours;
