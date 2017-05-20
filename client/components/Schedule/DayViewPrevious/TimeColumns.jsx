
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';

export default function TimeColumns({ workingHours, scale, tablesCount, totalColumns }) {
  const workingHoursColumn = {
    width: `${tablesCount / totalColumns}%`,
    display: 'inline-block',
  };
  const workingHour = {
    height: `${scale * 60}px`,
  };
  return (
    <div className={styles.schedule__header} style={workingHoursColumn}>
      {workingHours.map((h, i) => (
        <div key={i} className={styles.schedule__element} style={workingHour}>
          <div className={styles.schedule__date}>
            {moment({ hour: h, minute: 0 }).format('h:mm a')}
          </div>
        </div>
      ))}
    </div>
  );
}

TimeColumns.PropTypes = {
  workingHours: PropTypes.arrayOf(Array),
  scale: PropTypes.number,
  tablesCount: PropTypes.number,
};
