
import React, { PropTypes } from 'react';
import RequestData from './RequestData';
import styles from './style.scss';
import Icon from '../library/Icon';


export default function RequestShowData({ data }) {
  return (
    <div className={styles.requestShowData}>
      <div className={styles.requestShowData__nameAge}>{data.nameAge}</div>
      <div className={styles.requestShowata__time}>{data.time}</div>
      <div className={styles.requestShowData__service}>{data.service}</div>
      <div className={styles.requestShowData__phoneNumber}>
        <Icon icon = {'phone'} className={styles.requestShowData__icons}/>
        {data.phoneNumber}
      </div>
      <div className={styles.requestShowData__email}>
        <Icon icon={'envelope'} className={styles.requestShowData__icons}/>
        {data.email}
      </div>
      <div className={styles.requestShowData__insurance}>
        <Icon icon={'medkit'} className={styles.requestShowData__icons}/>
        {data.insurance}
      </div>
      <div className={styles.requestShowData__comment}>{data.comment}</div>
    </div>
  );
}


RequestShowData.propTypes = {};

