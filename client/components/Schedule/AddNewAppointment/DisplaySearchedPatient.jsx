import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Avatar, Icon } from '../../library';
import styles from './styles.scss';

export default function DisplaySearchedPatient(props) {
  const {
    patientSearched,
  } = props;

  let displayPatientComponent = null;
  if (patientSearched) {
    const bday = moment().diff(patientSearched.birthDate, 'years') || '';
    const lastName = bday ? `${patientSearched.lastName},` : patientSearched.lastName
    displayPatientComponent = (
      <div className={styles.patientSearch}>
        <Avatar className={styles.patientSearch_avatar} user={patientSearched || {}} />
        <div className={styles.patientSearch_name}>
          {`${patientSearched.firstName} ${lastName} ${bday || ''}`}
        </div>
        <div className={styles.patientSearch_email}>
          {`${patientSearched.email || ''}`}
        </div>
        <div className={styles.patientSearch_phone}>
          {`${patientSearched.mobilePhoneNumber || ''}`}
        </div>
      </div>
    );
  } else {
    displayPatientComponent = (
      <div className={styles.patientSearch}>
        <div className={styles.patientSearch_searchIcon}>
          <img src="/images/carecru_logo_collapsed.png" width="90px" height="90px" className={styles.patientSearch_img}/>
        </div>
        <div className={styles.patientSearch_speel}>
          Search for a patient by typing into the input below.
        </div>
      </div>
    )
  }
  return (
    <div>
      {displayPatientComponent}
    </div>
  );
}
