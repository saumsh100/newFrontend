
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

const CurrentDate = (props) => {
  const {
    currentDate,
    leftColumnWidth,
    children,
  } = props;

  const dayOfTheWeek = moment(currentDate).format('dddd');
  const dayOftheMonth = currentDate.date();
  const currentMonth = currentDate.format('MMM');

  const monthDayStyle = {
    width: leftColumnWidth,
    minWidth: leftColumnWidth,
  };

  return (
    <div className={styles.container}>
      <div className={styles.monthDay} style={monthDayStyle}>
        <div className={styles.number}>{dayOftheMonth > 9 ? dayOftheMonth : `0${dayOftheMonth}`}</div>
        <div className={styles.month}>{currentMonth}</div>
      </div>
      <div className={styles.dayOfWeek}>{dayOfTheWeek}</div>
      {children}
    </div>
  );
};

CurrentDate.propTypes = {
  currentDate: PropTypes.object,
  leftColumnWidth: PropTypes.number,
}

export default CurrentDate;
