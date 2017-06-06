import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';

export default function ShowDateInfo(props) {

  const {
    appointment,
  } = props;

  const month = moment(appointment.startDate).format('MMM');
  const day = moment(appointment.startDate).date();
  const year = moment(appointment.startDate).year();
  return (
    <div className={styles.dateContainer}>
      <div className={styles.dateContainer_month}>{month.toUpperCase()}</div>
      <div className={styles.dateContainer_day}>{day}</div>
      <div className={styles.dateContainer_year}>{year}</div>
    </div>
  )

}
