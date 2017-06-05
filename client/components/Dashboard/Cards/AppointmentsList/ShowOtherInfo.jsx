import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';

export default function ShowOtherInfo(props) {
  const {
    appointment,
    patient,
  } = props;

  return (
    <div className={styles.otherContainer}>
      <div>
        <span>{patient.mobilePhoneNumber}</span>
      </div>
      <div>
        <span>{patient.email}</span>
      </div>
    </div>
  );
}
