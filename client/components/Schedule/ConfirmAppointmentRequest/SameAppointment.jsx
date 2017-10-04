import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, Avatar, ListItem } from '../../library';
import styles from './styles.scss';

export default function SameAppointment(props) {
  const {
    patient,
    appointment,
  } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = moment(appointment.startDate);
  const endDate = moment(appointment.endDate);

  return (
    <ListItem className={styles.dataContainer}>
      <div className={styles.avatarContainer}>
        <Avatar size={'lg'} user={patient} />
      </div>
      <div className={styles.dataContainer_body}>
        <div className={styles.dataContainer_patientInfo}>
          <div className={styles.dataContainer_patientInfo_date}>
            {startDate.format('MMMM Do, YYYY')}
          </div>
          <div className={styles.dataContainer_patientInfo_date}>
            {startDate.format('h:mma')} - {endDate.format('h:mma')}
          </div>
        </div>
        <div className={styles.dataContainer_contactInfo}>
          <div className={styles.dataContainer_contactInfo_email}>{patient.get('email')}</div>
          <div className={styles.dataContainer_contactInfo_phone}>{patient.get('mobilePhoneNumber')}</div>
        </div>
      </div>
    </ListItem>
  );
}
