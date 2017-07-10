
import React, { Component, PropTypes } from 'react';
import ShowColumnHeader from './ShowColumnHeader';

import styles from '../styles.scss';

export default function TimeSlotColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
    columnWidth,
    index,
    scheduleView,
    columnHeaderName,
  } = props;

  return (
    <div
      key={index}
    >
      <ShowColumnHeader
        columnWidth={columnWidth}
        scheduleView={scheduleView}
        index={index}
        columnHeaderName={columnHeaderName}
      />
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

TimeSlotColumn.propTypes = {
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  index: PropTypes.number,
};
