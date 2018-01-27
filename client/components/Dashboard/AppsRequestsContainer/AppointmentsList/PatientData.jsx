
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from '../../../library';
import styles from '../styles.scss';
import { FormatPhoneNumber } from '../../../library/util/Formatters';

export default function PatientData(props) {
  const {
    patient,
    appointment,
  } = props;

  const age = moment().diff(patient.birthDate, 'years') || '';
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  return (
    <div className={styles.appPatientContainer}>
    <div className={styles.appPatientData}>
      <div className={styles.patientName}>{patient.firstName} {lastName} {age}</div>
      {patient.mobilePhoneNumber ? (<div className={styles.patientDetails}>
          <Icon icon="phone" size={0.9} />
        <div className={styles.patientDetails_data}>
          {FormatPhoneNumber(patient.mobilePhoneNumber)}
        </div>
      </div>) : null}

      {patient.email ? (<div className={styles.patientDetails}>
        <Icon icon="envelope" size={0.9} />
        <div className={styles.patientDetails_data}>
          {patient.email}
        </div>
      </div>) : null}

      <div className={styles.patientDetails}>
        <div className={styles.patientDetails_created}>
          Created: {moment(appointment.createdAt).format('MMM D, h:mm A')}
        </div>
      </div>
    </div>

      <div className={styles.appPatientConfirmed}>
        {appointment.isPatientConfirmed ? <div className={styles.iconContainer}>
          <Icon icon="check" /></div> : null}
      </div>
    </div>
  );
}
