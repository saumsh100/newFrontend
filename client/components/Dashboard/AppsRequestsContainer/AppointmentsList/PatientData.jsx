
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from '../../../library';
import styles from '../styles.scss';

export default function PatientData(props) {
  const { patient, appointment, practitioner } = props;

  const age = moment().diff(patient.birthDate, 'years') || '';
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  return (
    <div className={styles.appPatientContainer}>
      <div className={styles.appPatientData}>
        <div className={styles.patientName}>
          {patient.firstName} {lastName} {age}
        </div>

        <div className={styles.patientDetails}>
          <div className={styles.patientDetails_data}>{practitioner.getPrettyName()}</div>
        </div>
        <div className={styles.patientDetails}>
          <span className={styles.patientDetails_lastAppt}>Last Appt:&nbsp;</span>
          <span className={styles.patientDetails_date}>
            {patient.lastApptDate ? moment(patient.lastApptDate).format(' MMM D, YYYY') : ' n/a'}
          </span>
        </div>

        {/* <div className={styles.patientDetails}>
        <div className={styles.patientDetails_created}>
          Created: {moment(appointment.createdAt).format('MMM D, h:mm A')}
        </div>
      </div> */}
      </div>

      <div className={styles.appPatientConfirmed}>
        {appointment.isPatientConfirmed ? (
          <div className={styles.iconContainer}>
            <Icon icon="check" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
