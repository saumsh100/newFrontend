
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Icon } from '../../../library';
import styles from '../styles.scss';

export default function TimeColumn(props) {
  const {
    timeSlots,
    timeSlotHeight,
    leftColumnWidth,
    timeComponentDidMount,
  } = props;

  const timeColumnStyle = {
    width: leftColumnWidth,
    minWidth: leftColumnWidth,
  };

  return (
    <div
      style={timeColumnStyle}
      className={styles.timeColumn}
      ref={timeComponentDidMount}
    >
      {timeSlots.map((slot, index) => {
        const timePosition = {
          top: `${index * timeSlotHeight.height - 5}px`,
        };

        return (
          <div
            key={index}
            style={timeSlotHeight}
            className={styles.timeColumnItem}
          >
            {index > 0 ? (
              <div className={styles.timeColumnItem_time} style={timePosition}>
                {moment({ hour: slot.position, minute: 0 }).format('h A')}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

TimeColumn.propTypes = {
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  leftColumnWidth: PropTypes.number,
  timeComponentDidMount: PropTypes.func,
};
