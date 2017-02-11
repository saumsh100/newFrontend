
import React, { PropTypes } from 'react';
import styles from './style.scss';

export default function RequestData({ data }) {
  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{data.time}</div>
      <div className={styles.requestData__nameAge}>{data.nameAge}</div>
      <div className={styles.requestData__phoneNumber}>{data.phoneNumber}</div>
      <div className={styles.requestData__service}>{data.service}</div>
    </div>
  );
}

RequestData.propTypes = {};