
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';

export default function TimeOffDisplay({ values }) {
  const {
    startDate, endDate, startTime, endTime, allDay,
  } = values;

  const formattedSt = moment(startTime).format('LT');
  const formattedEt = moment(endTime).format('LT');

  const showDisplayComponent = allDay ? (
    <div>
      From : {startDate} To: {endDate}
    </div>
  ) : (
    <div>
      From: {startDate} {formattedSt} To: {endDate} {formattedEt}
    </div>
  );

  return <div className={styles.displayTimeOff}>{showDisplayComponent}</div>;
}
