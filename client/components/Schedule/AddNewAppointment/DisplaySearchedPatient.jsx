
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Icon } from '../../library';
import styles from './styles.scss';
import { FormatPhoneNumber } from '../../library/util/Formatters';

export default function DisplaySearchedPatient(props) {
  const {
    patient,
  } = props;

  return (
    <div>
      {patient ? <div
        className={styles.patientContainer}
        onClick={() => {
          props.setShowInput(true);
          props.setPatientSearched(null);
        }}
      >
        <Avatar user={patient} size="sm" />
        <div className={styles.patientContainer_name}>
          {patient.firstName} {patient.lastName}
        </div>
        <div className={styles.patientContainer_icon}>
          <Icon icon="search" />
        </div>
      </div> : null }
    </div>
  );
}

DisplaySearchedPatient.propTypes = {
  patient: PropTypes.object,
};
