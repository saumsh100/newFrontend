import React, { Component, PropTypes } from 'react';
import { ListItem, Button, Avatar } from '../../library';
import styles from './styles.scss';

export default function PatientData(props) {
  const {
    patient,
    handleUpdatePatient,
    selectPatient,
    selectedPatient
  } = props;

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
      <div
        className={styles.singleSuggestion}
        onClick={() => { selectPatient(patient)}}
      >
        <div className={styles.radioButton}>
          <input type="radio" checked={selectedPatient && selectedPatient.id === patient.id} />
        </div>
        <div
          className={styles.suggestionsListItem}
        >
          <Avatar size={'md'} className={styles.patientContainer_img} user={patient} alt="" />
          <div className={styles.patientContainer} >
            <div className={styles.patientContainer_fullName}>
              {fullName}
            </div>
            <div className={styles.patientContainer_email}>
              {patient.email}
            </div>
            <div className={styles.patientContainer_phone}>
              {patient.mobilePhoneNumber}
            </div>
          </div>
        </div>
      </div>
  );
}

PatientData.propTypes = {
};
