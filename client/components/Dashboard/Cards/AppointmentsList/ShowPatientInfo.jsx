
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';

export default function ShowPatientInfo(props) {
  const {
    appointment,
    patient,
    service,
    chair,
  } = props;

  const startHourMinute = moment(appointment.startDate).format('h:mm');
  const endHourMinute = moment(appointment.endDate).format('h:mm a');
  const time = startHourMinute.concat('-', endHourMinute);

  const age = moment().diff(patient.birthDate, 'years');

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className={styles.patientContainer}>
      <img className={styles.patientContainer_img} src={patient.avatarUrl || '/images/avatar.png'} alt="" />
      <div className={styles.patientContainer_text}>
        <div className={styles.patientContainer_name}>
          <span>{fullName.concat(', ', age)}</span>
        </div>
        <div className={styles.patientContainer_appTime}>
          <span>{time}</span>
        </div>
        <div className={styles.patientContainer_service}>
          <span>{service.name}, {chair.name}</span>
        </div>
      </div>
    </div>
  );
}
