
import React from 'react';
import styles from './day.scss';

export default (day, modifiers, hours = '8AM TO 9PM') => (
  <div className={styles.cell}>
    <div className={styles.single}>{day.getDate()}</div>
    <div className={styles.hours}>{hours}</div>
  </div>
);
