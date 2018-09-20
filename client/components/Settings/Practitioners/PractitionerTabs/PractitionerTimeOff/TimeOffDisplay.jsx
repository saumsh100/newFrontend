
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import styles from './styles.scss';
import { dateFormatter } from '../../../../../../iso/helpers/dateTimezone';

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
