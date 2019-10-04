
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../../library';
import styles from './styles.scss';
import PatientPopover from '../../../../library/PatientPopover';
import Patient from '../../../../../entities/models/Patient';

export default function PatientAvatarTitle({ patient }) {
  return (
    <div className={styles.wrapper}>
      <Avatar user={patient} className={styles.avatar} size="lg" />
      <PatientPopover patient={patient}>
        <div className={styles.title}>
          {patient.firstName} {patient.lastName}
        </div>
      </PatientPopover>
    </div>
  );
}

PatientAvatarTitle.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
};
