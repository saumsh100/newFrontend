
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Icon from '../library/Icon';


export default function AppointmentShowData({ time, nameAge, phoneNumber, service, email, note }) {
  return (
    <div className={styles.appointmentShowData}>
      <div className={styles.appointmentShowData__nameAge}>{nameAge}</div>
      <div className={styles.appointmentShowData__time}>{time}</div>
      <div className={styles.appointmentShowData__service}>{service}</div>
      <div className={styles.appointmentShowData__phoneNumber}>
        <Icon icon={'phone'} className={styles.appointmentShowData__icons} />
        {phoneNumber}
      </div>
      <div className={styles.appointmentShowData__email}>
        <Icon icon={'envelope'} className={styles.appointmentShowData__icons} />
        {email}
      </div>
      <div className={styles.appointmentShowData__insurance}>
        <Icon icon={'medkit'} className={styles.appointmentShowData__icons} />
      </div>
      <div className={styles.appointmentShowData__note}>
        <b>Note: </b>
        {note}
      </div>
    </div>
  );
}

AppointmentShowData.propTypes = {
};

