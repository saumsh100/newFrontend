
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../../library';
import styles from './styles.scss';
import { FormatPhoneNumber } from '../../../library/util/Formatters';

export default function PatientInfo(props) {
  const {
    patient,
  } = props;

  if (!patient) {
    return null;
  }

  return (
    <div className={styles.patientInfo}>
      <div className={styles.patientInfo_body}>
        <Avatar user={patient} size="lg" />
        <div className={styles.patientInfo_name}>
          {patient.firstName} {patient.lastName}
        </div>
        <div className={styles.patientInfo_otherInfo}>
         {FormatPhoneNumber(patient.mobilePhoneNumber)}
        </div>
        <div className={styles.patientInfo_otherInfo}>
          {patient.email}
        </div>
      </div>
    </div>
  );
}

PatientInfo.propTypes = {
  patient: PropTypes.object,
};
