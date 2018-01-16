
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from '../library';
import styles from './styles.scss';

function joinNumber(str){
  const newStr = str.slice(2,str.length);
  const insertStr = " ";
  return [newStr.slice(0, 3), insertStr, newStr.slice(3,6), insertStr, newStr.slice(6)].join('');
}
export default function RequestData(props){
  const {
    time,
    phoneNumber,
    service,
    name,
    requestCreatedAt,
  } = props;

  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{time}</div>
      <div className={styles.requestData__details}>
        <div className={styles.requestData__nameAge}>
          <div className={styles.requestData__name}>{name}</div>
        </div>
        <div className={styles.requestData__service}>{service}</div>
        <div className={styles.requestData__phoneNumber}>
          <Icon icon="phone" className={styles.requestData__icon}/>
          {joinNumber(phoneNumber)}
        </div>
      </div>
      <div className={styles.requestData__createdAt}>
        Requested: {moment(requestCreatedAt).format('MMM D, hh:mm A')}
      </div>
    </div>
  );
}

RequestData.propTypes = {
};
