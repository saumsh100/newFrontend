
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../../library';
import styles from './styles.scss';

export default function PatientAvatarTitle({ patient }) {
  return (
    <div className={styles.wrapper}>
      <Avatar user={patient} className={styles.avatar} size="lg" />
      <div className={styles.title}>
        {patient.firstName} {patient.lastName}
      </div>
    </div>
  );
}

PatientAvatarTitle.propTypes = {
  patient: PropTypes.object.isRequired,
};
