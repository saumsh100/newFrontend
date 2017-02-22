
import React, { PropTypes } from 'react';
import styles from './styles.scss';


export default function MonthDay({ month, day }) {
  return (
    <div className={styles.monthDay}>
      <div className={styles.monthDay__month}>
        {month.toUpperCase()}
      </div>
      <div className={styles.monthDay__day}>
        {day}
      </div>
    </div>
  );
}

MonthDay.propTypes = {};
