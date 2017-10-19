import React, { PropTypes } from 'react';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function PatientRow(props) {
  const {
    value,
    patient,
    redirect
  } = props;

  return (
    <div className={styles.patientRow}>
      <Avatar user={patient} />
      <div
        className={styles.name}
        onClick={(e) => {
          e.stopPropagation()
          redirect()
        }}
      >
        {`${patient.firstName} ${patient.lastName}`}
      </div>
    </div>
  );
}
