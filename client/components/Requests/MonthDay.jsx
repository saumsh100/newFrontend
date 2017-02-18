
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Icon from '../library/Icon';


export default function MonthDay({ month, day, isHovered }) {
  return (
    <div style={{display: "flex"}}>
    {isHovered? <Icon icon={'caret-right'} className={styles.iconCaret}/> : null}
  <div className={styles.monthDay}>
      <div className={styles.monthDay__month}>
        {month}
        <div className={styles.monthDay__day}>
          {day}
        </div>
      </div>
    </div>
    </div>
  );
}

MonthDay.propTypes = {};
