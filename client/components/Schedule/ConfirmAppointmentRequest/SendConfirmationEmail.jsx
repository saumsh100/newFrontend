import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../library';
import Patient from '../../../entities/models/Patient';
import styles from './reskin-styles.scss';

const SendConfirmationEmail = (props) => {
  const { confirmRequest, patient } = props;

  return (
    <div className={styles.container}>
      <div className={styles.dataContainer_bodyEmail}>
        Would you like to send an email confirmation to{' '}
        <span className={styles.bold}>{patient?.getFullName()}</span>?
      </div>

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
            <div className={styles.dataContainer_contactInfo_email}>
              {patient.get('email')}
            </div>
            <div className={styles.dataContainer_contactInfo_phone}>
              {patient.get('mobilePhoneNumber')}
            </div>
          </div>
        </div>
      </div> : null */}
      <div className={styles.buttonContainer}>
        <Button border="blue" onClick={() => confirmRequest(patient, false)}>
          No
        </Button>
        <Button
          className={styles.buttonContainer_yes}
          color="blue"
          onClick={() => confirmRequest(patient, true)}
        >
          Yes
        </Button>
      </div>
    </div>
  );
};

SendConfirmationEmail.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  confirmRequest: PropTypes.func.isRequired,
};

export default SendConfirmationEmail;
