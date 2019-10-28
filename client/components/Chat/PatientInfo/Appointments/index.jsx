
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Row, Col } from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import { patientShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';

const prettyApptDate = date => (date ? moment(date).format('MMM DD, YYYY') : 'n/a');

export default function Appointments({ patient }) {
  return (
    <div>
      <PatientAvatarTitle patient={patient} />
      <div className={styles.content}>
        <Grid>
          <Row>
            <Col xs={6}>
              <Content title="Last Appt" value={prettyApptDate(patient.lastApptDate)} />
              <Content title="Last Hygiene" value={prettyApptDate(patient.lastHygieneDate)} />
              <Content title="Last Recall" value={prettyApptDate(patient.lastRecallDate)} />
            </Col>
            <Col xs={6}>
              <Content title="Next Appt" value={prettyApptDate(patient.nextApptDate)} />
              <Content
                title="Last Restorative"
                value={prettyApptDate(patient.lastRestorativeDate)}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

Appointments.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
};
