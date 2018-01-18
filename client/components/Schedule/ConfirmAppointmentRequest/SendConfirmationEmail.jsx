
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Icon, Button } from '../../library';
import styles from './styles.scss';

export default function SendConfirmationEmail(props) {
  const {
    selectedApp,
    confirmRequest,
    patient,
    length,
  } = props;

  const startDate = moment(selectedApp.startDate);
  const endDate = moment(selectedApp.endDate);

  return (
    <div className={styles.container}>
      Would you like to send an email confirmation to <span className={styles.bold}>{patient.getFullName()}</span>?
      {/* length > 1 ? <div className={styles.dataContainer_bodyEmail} >
        <div className={styles.avatarContainer}>
          <Icon size={2} icon="calendar" />
        </div>
        <div className={styles.singleItemEmail}>
          <div className={styles.dataContainer_patientInfo}>
            <div className={styles.dataContainer_patientInfo_date}>
              {startDate.format('MMMM Do, YYYY')}
            </div>
            <div className={styles.dataContainer_patientInfo_date}>
              {startDate.format('h:mma')} - {endDate.format('h:mma')}
            </div>
          </div>
          <div className={styles.dataContainer_contactInfoEmail}>
            <div className={styles.dataContainer_contactInfo_email}>{patient.get('email')}</div>
            <div className={styles.dataContainer_contactInfo_phone}>{patient.get('mobilePhoneNumber')}</div>
          </div>
        </div>
      </div> : null */}
      <div className={styles.buttonContainer}>
        <Button border="blue" onClick={() => confirmRequest(patient, false)}>
          No
        </Button>
        <Button className={styles.buttonContainer_yes} color="blue" onClick={() => confirmRequest(patient, true)}>
          Yes
        </Button>
      </div>
    </div>
  )
}
