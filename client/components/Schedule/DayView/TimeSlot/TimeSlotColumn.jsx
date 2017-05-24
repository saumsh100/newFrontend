
import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';

export default function TimeSlotColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
    columnWidth,
    index,
  } = props;

  return (
    <div key={index}>
      {timeSlots.map((slot, i) => {
        return (
          <div key={i} className={styles.dayView_body_timeSlotColumn} style={timeSlotHeight}>
            {''}
          </div>
        );
      })}
    </div>
  );
}
