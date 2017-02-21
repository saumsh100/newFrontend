
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function RequestData({ time, nameAge, phoneNumber, service }){

  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{time}</div>
      <div className={styles.requestData__nameAge}>{nameAge}</div>
      <div className={styles.requestData__phoneNumber}>{phoneNumber}</div>
      <div className={styles.requestData__service}>{service}</div>
    </div>
  );
}

RequestData.propTypes = {
};