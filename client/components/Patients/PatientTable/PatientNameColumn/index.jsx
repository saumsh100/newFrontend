import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../library';
import patientShape from '../../../library/PropTypeShapes/patient';
import styles from './styles.scss';

export default function PatientNameColumn({ patient, redirect, text, isAvatar }) {
  return (
    <div
      className={styles.patientRow}
      role="button"
      tabIndex="-1"
      onKeyDown={({ keyCode }) => keyCode === 13 && redirect()}
      onClick={(e) => {
        e.stopPropagation();
        redirect();
      }}
    >
      <div className={styles.avatarContainer}>
        {isAvatar && <Avatar user={patient} size="xs" />}
      </div>
      <div className={styles.name}>{text}</div>
    </div>
  );
}

PatientNameColumn.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  redirect: PropTypes.func.isRequired,
  text: PropTypes.string,
  isAvatar: PropTypes.bool,
};

PatientNameColumn.defaultProps = {
  text: '',
  isAvatar: false,
};
