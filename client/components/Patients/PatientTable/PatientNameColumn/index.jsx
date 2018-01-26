import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../library';
import styles from './styles.scss';

export default function PatientNameColumn(props) {
  const {
    patient,
    redirect,
    text,
    noAvatar,
  } = props;

  return (
    <div className={styles.patientRow}>
      <div className={styles.avatarContainer}>
      {!noAvatar ? <Avatar user={patient} size="sm" /> : null}
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

PatientNameColumn.propTypes = {
  patient: PropTypes.object,
  redirect: PropTypes.func,
  text: PropTypes.string,
  noAvatar: PropTypes.bool,
}
