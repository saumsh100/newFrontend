
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Icon from '../library/Icon';


export default function AppointmentShowData({ data }) {
  return (
    <div className={styles.appointmentShowData}>
      <div className={styles.appointmentShowData__nameAge}>{data.nameAge}</div>
      <div className={styles.appointmentShowData__time}>{data.time}</div>
      <div className={styles.appointmentShowData__service}>{data.service}</div>
      <div className={styles.appointmentShowData__phoneNumber}>
        <Icon icon={'phone'} className={styles.appointmentShowData__icons}/>
        {data.phoneNumber}
      </div>
      <div className={styles.appointmentShowData__email}>
        <Icon icon={'envelope'} className={styles.appointmentShowData__icons}/>
        {data.email}
      </div>
      <div className={styles.appointmentShowData__insurance}>
        <Icon icon={'medkit'} className={styles.appointmentShowData__icons}/>
      </div>
      <div className={styles.appointmentShowData__comment}>
        <b>Note: </b>
        {data.comment}
      </div>
    </div>
  );
}

AppointmentShowData.propTypes = {
  data: PropTypes.object.isRequired,
};

