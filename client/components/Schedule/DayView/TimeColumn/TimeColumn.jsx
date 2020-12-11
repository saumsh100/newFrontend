
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.scss';
import { getDate } from '../../../library';

export default function TimeColumn(props) {
  const { timeSlots, timeSlotHeight, leftColumnWidth, timeComponentDidMount } = props;

  const timeColumnStyle = {
    width: leftColumnWidth,
    minWidth: leftColumnWidth,
  };

  return (
    <div style={timeColumnStyle} className={styles.timeColumn} ref={timeComponentDidMount}>
      {timeSlots.map((slot, index) => {
        const maxTop = index * timeSlotHeight.height;
        const key = `timeColumnItem-${index}`;
        const timePosition = {
          top: `${maxTop - 5}px`,
        };

        return (
          <div key={key} style={timeSlotHeight} className={styles.timeColumnItem}>
            {index > 0 ? (
              <div className={styles.timeColumnItem_time} style={timePosition}>
                {getDate({
                  hour: slot.position,
                  minute: 0,
                }).format('h A')}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

TimeColumn.propTypes = {
  timeSlots: PropTypes.arrayOf(PropTypes.shape({ position: PropTypes.number.isRequired })),
  timeSlotHeight: PropTypes.shape({ height: PropTypes.number.isRequired }),
  leftColumnWidth: PropTypes.number,
  timeComponentDidMount: PropTypes.shape({ current: PropTypes.any }),
};

TimeColumn.defaultProps = {
  timeSlots: null,
  timeSlotHeight: null,
  leftColumnWidth: null,
  timeComponentDidMount: null,
};
