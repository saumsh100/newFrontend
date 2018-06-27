
import React, { Component, PropTypes } from 'react';
import ColumnHeader from '../ColumnHeader/index';

import styles from '../styles.scss';

export default function TimeSlotColumn(props) {
  const { timeSlots, timeSlotHeight } = props;

  return (
    <div>
      {timeSlots.map((slot, i) => (
        <div
          key={i + Math.random()}
          className={styles.timeSlotColumnItem}
          style={timeSlotHeight}
        >
          {''}
        </div>
        ))}
    </div>
  );
}

TimeSlotColumn.propTypes = {
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  index: PropTypes.number,
};
