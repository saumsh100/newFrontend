
import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import styles from '../styles.scss';

export default function TimeColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
    width,
    timeComponentDidMount,
  } = props;

  return (
    <div style={{ width, minWidth: width }} className={styles.timeColumn} ref={timeComponentDidMount}>
      {/*<div key={Math.random()} style={timeSlotHeight} className={styles.dayView_body_timeColumnItem}>
        <div className={styles.dayView_body_timeColumnItem_gmt}>GMT-08</div>
      </div>*/}
      {timeSlots.map((slot, index, arr) => {
        return (
          <div key={index} style={timeSlotHeight} className={styles.timeColumnItem}>
            <div className={styles.timeColumnItem_time}>{moment({ hour: slot.position, minute: 0 }).format('h A')}</div>
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
