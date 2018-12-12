
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { dateFormatter } from '@carecru/isomorphic';
import styles from './styles.scss';

export default function TimeOffDisplay({ values, timezone }) {
  const { startDate, endDate, startTime, endTime, allDay } = values;

  const startDateFormatted = moment(startDate).format('l');
  const endDateFormatted = moment(endDate).format('l');
  const formattedSt = dateFormatter(startTime, timezone, 'LT');
  const formattedEt = dateFormatter(endTime, timezone, 'LT');

  const showDisplayComponent = allDay ? (
    <div>
      From : {startDateFormatted} To: {endDateFormatted}
    </div>
  ) : (
    <div>
      From: {startDateFormatted} {formattedSt} To: {endDateFormatted} {formattedEt}
    </div>
  );

  return <div className={styles.displayTimeOff}>{showDisplayComponent}</div>;
}

TimeOffDisplay.propTypes = {
  values: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    allDay: PropTypes.bool,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
