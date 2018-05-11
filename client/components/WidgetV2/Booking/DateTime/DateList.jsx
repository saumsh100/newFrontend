
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Button from '../../../library/Button';
import styles from './styles.scss';

function DateList({ dayAvailabilities, selectDate, onChangeDate }) {
  return (
    <div className={styles.datesWrapper}>
      {dayAvailabilities.map((date, i) => {
        const isoDate = date.toISOString();
        const buttonClass = selectDate === isoDate ? styles.selectedDaySlot : styles.daySlot;
        return (
          <Button className={buttonClass} key={`date_${i}`} onClick={() => onChangeDate(isoDate)}>
            <span className={styles.weekDay}>{date.format('ddd')}</span>
            <span className={styles.day}>{date.format('DD')}</span>
            <span className={styles.month}>{date.format('MMM')}</span>
          </Button>
        );
      })}
    </div>
  );
}

export default DateList;

DateList.propTypes = {
  dayAvailabilities: PropTypes.arrayOf(PropTypes.instanceOf(moment)),
  selectDate: PropTypes.string.isRequired,
  onChangeDate: PropTypes.func.isRequired,
};
