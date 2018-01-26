
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Icon,  ListItem } from '../../library';
import styles from './styles.scss';

export default function SameAppointment(props) {
  const {
    patient,
    appointment,
    setSelected,
    selectedApp,
  } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = moment(appointment.startDate);
  const endDate = moment(appointment.endDate);

  const dataContainer = styles.dataContainer;

  return (
    <div className={styles.singleItem}>
      <input type="radio" checked={appointment.id === (selectedApp && selectedApp.id)} className={styles.radio}/>
      <div
        className={dataContainer}
        onClick={()=> {
          setSelected(appointment);
        }}
      >
        <div className={styles.avatarContainer}>
          <Icon size={2} icon="calendar" />
        </div>
        <div className={styles.dataContainer_body}>
          <div className={styles.dataContainer_patientInfo}>
            <div className={styles.dataContainer_patientInfo_date}>
              {startDate.format('MMMM Do, YYYY')}
            </div>
            <div className={styles.dataContainer_patientInfo_date}>
              {startDate.format('h:mma')} - {endDate.format('h:mma')}
            </div>
            <div className={styles.dataContainer_patientInfo_createdAt}>
              Created At: {moment(appointment.createdAt).format('MMMM Do, YYYY h:mm A')}
            </div>
          </div>
          <div className={styles.dataContainer_contactInfo}>
            <div className={styles.dataContainer_contactInfo_email}>{patient.get('email')}</div>
            <div className={styles.dataContainer_contactInfo_phone}>{patient.get('mobilePhoneNumber')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
