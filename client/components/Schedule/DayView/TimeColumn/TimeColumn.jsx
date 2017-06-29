
import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import styles from '../styles.scss';

export default function TimeColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
  } = props;


  return (
    <div>
      {timeSlots.map((slot, index) => {
        return (
          <div key={index} className={styles.dayView_body_timeColumn} style={timeSlotHeight}>
            {moment({ hour: slot.position, minute: 0 }).format('h:mm a')}
          </div>
        );
      })}
    </div>
  );
}

TimeColumn.propTypes = {
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
};
