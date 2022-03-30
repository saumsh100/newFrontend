
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles.scss';

export default function TimeSlotColumn(props) {
  const { prefixKey, timeSlots } = props;

  return (
    <div>
      {timeSlots.map((slot, i) => (
        <div
          key={`${btoa(prefixKey + i)}`}
          className={styles.timeSlotColumnItem}
        />
      ))}
    </div>
  );
}

TimeSlotColumn.propTypes = {
  prefixKey: PropTypes.string.isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
    }),
  ).isRequired,
};
