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

  const currentYear = new Date().getFullYear();
  const birthday = moment(patient.birthDate).year();
  const age = currentYear - birthday;
  const fullName = `${patient.firstName} ${patient.lastName}`;
  return (
    <div className={styles.patientContainer}>
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
  )

}
