
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Icon from '../library/Icon';


export default function MonthDay({ month, day, isHovered }) {
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
