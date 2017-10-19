import React, { PropTypes } from 'react';
import { Avatar } from '../../../library'
import styles from './styles.scss';

export default function PatientRow(props) {
  const {
    value,
    patient,
  } = props;

  return (
    <div className={styles.patientRow}>
      <Avatar user={patient} className={styles.avatarContainer_avatar} />
      {value}
    </div>
  );
}
