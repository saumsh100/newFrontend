
import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';

export default function TimeColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
  } = props;


  return (
    <div>
      {timeSlots.map((slot, index) => {
        let hour = slot.position ;
        let period = 'am';

        if (hour === 12) {
          period = 'pm';
        } else if (hour > 12) {
          hour -= 12;
          period = 'pm';
        } else if (hour === 0) {
          hour = 12;
        }

        return (
          <div key={index} className={styles.dayView_body_timeColumn} style={timeSlotHeight}>
            {`${hour}:00${period}`}
          </div>
        );
      })}
    </div>
  );
}
