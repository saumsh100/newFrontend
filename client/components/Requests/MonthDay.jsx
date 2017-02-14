
import React, { PropTypes } from 'react';
import styles from './style.scss';

export default function MonthDay({ month, day }) {
  return (
    <div className={styles.monthDay}>
      <div className={styles.monthDay__month}>
        {month}
      </div>
      <div className={styles.monthDay__day}>
        {day}
      </div>
    </div>
  );
}

MonthDay.propTypes = {};
