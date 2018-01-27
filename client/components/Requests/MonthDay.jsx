
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function MonthDay({ month, day }) {
  return (
    <div className={styles.monthDay}>
      <div className={styles.monthDay_month}>
        {month.toUpperCase()}
      </div>
      <div className={styles.monthDay_day}>
        {day}
      </div>
      <div className={styles.monthDay_new}>NEW</div>
    </div>
  );
}

MonthDay.propTypes = {};
