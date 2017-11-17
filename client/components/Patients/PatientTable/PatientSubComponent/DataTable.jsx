import React, { PropTypes } from 'react';
import moment from 'moment'
import { Grid, Row, Col } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import RecallDropDowns from '../../Shared/RecallDropDowns';
import ReminderDropDowns from '../../Shared/ReminderDropDowns';
import styles from './styles.scss';

export default function DataTable(props) {
  const {
    patient,
  } = props;

  const recallComp = <RecallDropDowns patient={patient} />
  const reminderComp = <ReminderDropDowns patient={patient} />

  return (
    <Grid className={styles.grid}>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="PRIMARY EMAIL"
            data={patient.email}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="PRIMARY-NUMBER"
            data={patient.mobilePhoneNumber}
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={12} >
          <InfoDump
            label="INSURANCE"
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={12} >
          <InfoDump
            label="RECALLS SENT"
            component={recallComp}
          />
          {patient.nextApptDate ? (<div className={styles.subHeaderSmall}>
            Next Appointment: {moment(patient.nextApptDate).format('MMMM Do YYYY')}
          </div>) : ''}
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={12} >
          <InfoDump
            label="REMINDERS SENT"
            component={reminderComp}
          />
          {patient.nextApptDate ? (<div className={styles.subHeaderSmall}>
            Next Appointment: {moment(patient.nextApptDate).format('MMMM Do YYYY')}
          </div>) : ''}
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="LAST RECALL VISIT"
          />
        </Col>
        <Col xs={6} >
          <InfoDump
            label="LAST HYGIENE VIST"
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="LAST X-RAY"
          />
        </Col>
      </Row>
    </Grid>
  )
}
