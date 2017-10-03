import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, Avatar, ListItem } from '../../library';
import styles from './styles.scss';

export default function SameAppointment(props) {
  const {
    patient,
    appointment,
    createAppointment,
    confirmRequest,
    setConfirmState,
  } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = moment(appointment.get('startDate'));
  const endDate = moment(appointment.get('endDate'));

  return (
    <div className={styles.container}>
      <div className={styles.text}>It seems like an appointment was already created for
        <div className={styles.listItemHeader}>{patient.get('firstName')} on {startDate.format('MMMM Do, YYYY')} from
          &nbsp;{startDate.format('h:mma')} - {endDate.format('h:mma')}.
        </div>
        If you would like us to send an appointment confirmation email to
        <span> {patient.get('firstName')}</span>, please click Yes.
      </div>
      <ListItem className={styles.dataContainer}>
        <div className={styles.avatarContainer}>
          <Avatar size={'lg'} user={patient} />
        </div>
        <div className={styles.dataContainer_body}>
          <div className={styles.dataContainer_patientInfo}>
            <div className={styles.dataContainer_patientInfo_fullName}>
              {patient.getFullName()}
            </div>
            <div className={styles.dataContainer_patientInfo_date}>
              {startDate.format('h:mma')} - {endDate.format('h:mma')}
            </div>
          </div>
          <div className={styles.dataContainer_contactInfo}>
            <div className={styles.dataContainer_contactInfo_email}>{patient.get('email')}</div>
            <div className={styles.dataContainer_contactInfo_phone}>{patient.get('mobilePhoneNumber')}</div>
          </div>
        </div>
      </ListItem>
      <div className={styles.buttonContainer}>
        <Button icon="times" onClick={() => setConfirmState()}>
          No
        </Button>
        <Button icon="check" onClick={() => confirmRequest(patient)}>
          Yes
        </Button>
      </div>
    </div>
  );
}
