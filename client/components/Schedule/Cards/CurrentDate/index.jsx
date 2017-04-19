import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../../styles.scss';

const CurrentDate = (props) => {
  const { currentDate } = props;
  const dayOftheWeek = new Date(currentDate._d).toLocaleString('en-us', {  weekday: 'long' });
  const dayOftheMonth = currentDate.date();
  const currentMonth = currentDate.format("MMMM");
  return (
    <div>
      <div className={styles.title__side}>
        <div className={styles.title__month}>{currentMonth}</div>
        <div className={styles.title__day}>{dayOftheWeek}</div>
      </div>
      <div className={styles.title__number}>{dayOftheMonth}</div>
    </div>
  );
};


export default CurrentDate;
