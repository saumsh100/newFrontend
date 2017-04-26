import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../../styles.scss';

const CurrentDateCalendar = (props) => {
  const { currentDate } = props;
  const dayOftheWeek = new Date(currentDate._d).toLocaleString('en-us', {  weekday: 'long' });
  const dayOftheMonth = currentDate.date();
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");
  return (
    <div className={styles.calendarTitle}>
      <div className={styles.calendarTitle__month}>
        {currentMonth}
        <div className={styles.calendarTitle__dayWeek}>{dayOftheWeek}</div>
      </div>
      <div className={styles.calendarTitle__dayMonth}>{dayOftheMonth}</div>
    </div>
  );
};


export default CurrentDateCalendar;
