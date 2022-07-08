import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './reskin-styles.scss';
import { getUTCDate } from '../../../library';

/**
 * Function to shorten the time string based on the minutes
 * Can also set the AM/PM indicator
 * @param {DateTimeObj} date
 * @param {boolean} addAtoFormat
 * @returns {string}
 */
const shortenTime = (date, addAtoFormat = true) => {
  const aFormat = addAtoFormat ? 'a' : '';

  return date.get('minutes') === 0 ? date.format(`h${aFormat}`) : date.format(`h:mm${aFormat}`);
};

/**
 * Function that builds the correct format to display the times.
 * Supress the AM/PM of the end and start times are the same.
 * @param {string | DateTimeObj} startDate
 * @param {string} timezone
 * @param {string | DateTimeObj} endDate
 */
const buildHoursFormat = (startDate, timezone, endDate = null) => {
  startDate = getUTCDate(startDate, timezone);

  if (!endDate) return shortenTime(startDate);

  endDate = getUTCDate(endDate, timezone);

  const afternoon = 12;
  const addAtoFormat =
    (startDate.get('hour') >= afternoon && endDate.get('hour') >= afternoon) ||
    (startDate.get('hour') < afternoon && endDate.get('hour') < afternoon);

  return `${shortenTime(startDate, !addAtoFormat)} - ${shortenTime(endDate)}`;
};

/**
 * Builds the final string to display.
 * @param {string | DateTimeObj} startDate
 * @param {string | DateTimeObj} endDate
 * @param {string} timezone
 * @param {boolean} inline
 */
const buildHoursString = (startDate, endDate, timezone, inline = false) =>
  inline ? buildHoursFormat(startDate, timezone) : buildHoursFormat(startDate, timezone, endDate);

/**
 * Hours presenter component
 *
 * @param {date} startDate
 * @param {date} endDate
 * @param {boolean} inline - add a comma if true
 */
const AppointmentHours = ({ className, startDate, endDate, inline = false, timezone }) => (
  <span className={classnames(styles.nameContainer_hours, className)}>
    {inline && ','} {buildHoursString(startDate, endDate, timezone, inline)}
  </span>
);

AppointmentHours.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({ nameContainer_hours: PropTypes.string }),
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

AppointmentHours.defaultProps = {
  className: '',
  style: null,
  inline: false,
};

export default AppointmentHours;
