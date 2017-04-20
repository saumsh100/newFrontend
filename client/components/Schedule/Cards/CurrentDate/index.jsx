import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../../styles.scss';

const CurrentDate = (props) => {
  const { currentDate } = props;
  const dayOftheWeek = new Date(currentDate._d).toLocaleString('en-us', {  weekday: 'long' });
  const dayOftheMonth = currentDate.date();
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");
  return (
    <div style={{display: 'flex'}}>
      <div className={styles.title__month}>{currentMonth}</div>
      <div className={styles.title__number}>&nbsp;{dayOftheMonth}</div>
      <div className={styles.title__day}>, {currentYear}</div>
      {props.children}

    </div>
  );
};


export default CurrentDate;
