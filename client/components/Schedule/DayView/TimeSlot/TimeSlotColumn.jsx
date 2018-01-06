
import React, { Component, PropTypes } from 'react';
import ColumnHeader from '../ColumnHeader/index';

import styles from '../styles.scss';

export default function TimeSlotColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
    index,
  } = props;

  return (
    <div
      key={index}
    >
      {timeSlots.map((slot, i) => {
        return (
          <div key={i} className={styles.dayView_body_timeSlotColumn} style={{
            height: timeSlotHeight.height,
            width: `100%`,
            minWidth: `100%`,
          }}>
            {''}
          </div>
        );
      })}
    </div>
  );
}

TimeSlotColumn.propTypes = {
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  index: PropTypes.number,
};
