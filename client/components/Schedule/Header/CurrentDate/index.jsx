
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

const getDateValues = (value, mDate = moment(value)) => ({
  weekday: mDate.format('dddd'),
  date: mDate.format('DD'),
  month: mDate.format('MMM'),
});

const CurrentDate = ({ currentDate, leftColumnWidth, children }) => {
  const { date, month, weekday } = getDateValues(currentDate);
  return (
    <div className={styles.container}>
      <div
        className={styles.monthDay}
        style={{
          width: leftColumnWidth,
          minWidth: leftColumnWidth,
        }}
      >
        <div className={styles.number}>{date}</div>
        <div className={styles.month}>{month}</div>
      </div>
      <div className={styles.dayOfWeek}>{weekday}</div>
      {children}
    </div>
  );
};

CurrentDate.propTypes = {
  currentDate: PropTypes.string.isRequired,
  leftColumnWidth: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default React.memo(CurrentDate);
