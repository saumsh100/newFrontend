import React, { PropTypes } from 'react';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function PatientNameColumn(props) {
  const {
    value,
    patient,
    redirect,
    text,
    noAvatar,
  } = props;

  return (
    <div className={styles.patientRow}>
      <div className={styles.avatarContainer}>
      {!noAvatar ? <Avatar user={patient} /> : null}
      </div>
      <div
        className={styles.name}
        onClick={(e) => {
          e.stopPropagation();
          redirect();
        }}
      >
        {text}
      </div>
    </div>
  );
}
