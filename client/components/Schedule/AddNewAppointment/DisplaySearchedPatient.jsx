import React, { Component, PropTypes } from 'react';
import { Avatar } from '../../library';
import styles from './styles.scss';

export default function DisplaySearchedPatient(props) {
  const {
    patientSearched,
  } = props;

  console.log(patientSearched);

  return (
    <div className={styles.patientSearch}>
      <Avatar className={styles.patientSearch_avatar} user={patientSearched || {}} />
    </div>
  );
}
