
import React, { PropTypes } from 'react';
import styles from './styles.scss';

function joinNumber(str){
  const newStr = str.slice(2,str.length);
  const insertStr = " ";
  return [newStr.slice(0, 3), insertStr, newStr.slice(3,6), insertStr, newStr.slice(6)].join('');
}
export default function RequestData({ time, phoneNumber, service, name, age, handlePatientClick, id }){

  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{time}</div>
      <div className={styles.requestData__nameAge}>
        <a
          className={styles.requestData__nameAge}
          onClick={()=>handlePatientClick(id)}
          href="#"
        >
          <div className={styles.requestData__name}>{name}, {age}</div>
        </a>
      </div>
      <div className={styles.requestData__phoneNumber}>{joinNumber(phoneNumber)}</div>
      <div className={styles.requestData__service}>{service}</div>
    </div>
  );
}

RequestData.propTypes = {
};
