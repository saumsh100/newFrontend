import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button, Avatar, ListItem } from '../../library';
import styles from './styles.scss';

export default function CreateAppointment(props) {
  const {
    patient,
    request,
    reinitializeState,
    createAppointment,
  } = props;

  const startDate = moment(request.get('startDate'));
  const endDate = moment(request.get('endDate'));

  return (
    <div className={styles.container}>
      <div className={styles.text}>Would you like to create an appointment for
        <div className={styles.listItemHeader}>{patient.get('firstName')} on {startDate.format('MMMM Do, YYYY')} from
          &nbsp;{startDate.format('h:mma')} - {endDate.format('h:mma')}?
        </div>
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
        <Button icon="times" color="darkgrey" onClick={() => reinitializeState()}>
          No
        </Button>
        <Button icon="check" tertiary onClick={() => createAppointment()}>
          Yes
        </Button>
      </div>
    </div>
  );
}
