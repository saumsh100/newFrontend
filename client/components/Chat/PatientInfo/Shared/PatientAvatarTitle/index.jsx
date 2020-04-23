
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../../library';
import Patient from '../../../../../entities/models/Patient';
import PatientName from '../../../ToHeader/PatientName';
import styles from './styles.scss';

export default function PatientAvatarTitle({ patient }) {
  return (
    <div className={styles.wrapper}>
      <Avatar user={patient} className={styles.avatar} size="lg" />
      <div className={styles.title}>
        <PatientName selectedPatient={patient} />
      </div>
    </div>
  );
}

PatientAvatarTitle.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
};
