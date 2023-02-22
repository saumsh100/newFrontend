import React from 'react';
import PropTypes from 'prop-types';
import styles from '../Dashboard/styles';

export default function MonthDay({ month, day, type, tab, cancellationDay }) {
  return (
    <div className={ cancellationDay ? styles.cancellationMonthDay : tab ? styles.dashReqMonthDay : styles.monthDay}>
      <div className={styles.monthDay_month}>{month}</div>
      <div className={cancellationDay ? styles.monthDay_cancellationDay : styles.monthDay_day}>
        {day}
      </div>
      {type ? <div className={styles.monthDay_new}>{type}</div> : null}
    </div>
  );
}

MonthDay.propTypes = {
  month: PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  cancellationDay: PropTypes.bool.isRequired,
};
