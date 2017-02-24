
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Icon from '../library/Icon';

function joinNumber(str){
  const newStr = str.slice(2,str.length);
  const insertStr = " ";
  return [newStr.slice(0, 3), insertStr, newStr.slice(3,6), insertStr, newStr.slice(6)].join('');
}

export default function AppointmentShowData({ time, nameAge, phoneNumber, service, email, note }) {
  return (
    <div className={styles.appointmentShowData}>
      <div className={styles.appointmentShowData__nameAge}>{nameAge}</div>
      <div className={styles.appointmentShowData__time}>{time}</div>
      <div className={styles.appointmentShowData__service}>{service}</div>
      <div className={styles.appointmentShowData__phoneNumber}>
        <Icon icon={'phone'} className={styles.appointmentShowData__icons} />
        {joinNumber(phoneNumber)}
      </div>
      <div className={styles.appointmentShowData__email}>
        <Icon icon={'envelope'} className={styles.appointmentShowData__icons} />
        {email}
      </div>
      <div className={styles.appointmentShowData__insurance}>
        <Icon icon={'medkit'} className={styles.appointmentShowData__icons} />
      </div>
      <div className={styles.appointmentShowData__note}>
        <span className={styles.noteText}><b>Note: </b></span>
        {note}
      </div>
    </div>
  );
}

AppointmentShowData.propTypes = {
};

