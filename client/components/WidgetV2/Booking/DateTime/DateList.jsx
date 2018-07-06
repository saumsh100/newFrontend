
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Button from '../../../library/Button';
import { IconButton } from '../../../library';
import styles from './styles.scss';

function DateList({ dayAvailabilities, onDateChange, selectDate }) {
  return (
    <div className={styles.datesContainer}>
      <IconButton
        disabled={moment(selectDate).isSame(new Date().toISOString(), 'day')}
        icon="angle-left"
        className={styles.arrows}
        onClick={() =>
          onDateChange(moment(selectDate)
              .subtract('1', 'day')
              .toISOString())
        }
      />
      <div className={styles.datesWrapper}>
        {dayAvailabilities.map((date) => {
          const isoDate = date.toISOString();
          const buttonClass = selectDate === isoDate ? styles.selectedDaySlot : styles.daySlot;
          return (
            <Button
              className={buttonClass}
              key={`date_${isoDate}`}
              onClick={() => onDateChange(isoDate)}
            >
              <span className={styles.weekDay}>{date.format('ddd')}</span>
              <span className={styles.day}>{date.format('DD')}</span>
              <span className={styles.month}>{date.format('MMM')}</span>
            </Button>
          );
        })}
      </div>
      <IconButton
        icon="angle-right"
        className={styles.arrows}
        onClick={() =>
          onDateChange(moment(selectDate)
              .add('1', 'day')
              .toISOString())
        }
      />
    </div>
  );
}

export default DateList;

DateList.propTypes = {
  dayAvailabilities: PropTypes.arrayOf(PropTypes.instanceOf(moment)).isRequired,
  selectDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
};
