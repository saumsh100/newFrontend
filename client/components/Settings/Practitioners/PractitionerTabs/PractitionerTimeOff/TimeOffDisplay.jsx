
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { getFormattedDate } from '../../../../library/util/datetime';

export default function TimeOffDisplay({ values, timezone }) {
  const { startDate, endDate, startTime, endTime, allDay } = values;

  const startDateFormatted = getFormattedDate(startDate, 'l');
  const endDateFormatted = getFormattedDate(endDate, 'l');
  const formattedSt = getFormattedDate(startTime, 'LT', timezone, true);
  const formattedEt = getFormattedDate(endTime, 'LT', timezone, true);

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
