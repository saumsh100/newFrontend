
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col, getUTCDate } from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import { patientShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';

function Appointments({ patient, timezone }) {
  const prettyDate = date => (date ? getUTCDate(date, timezone).format('MMM DD, YYYY') : 'n/a');
  return (
    <div>
      <PatientAvatarTitle patient={patient} />
      <div className={styles.content}>
        <Grid>
          <Row>
            <Col xs={6}>
              <Content title="Last Appt" value={prettyDate(patient.lastApptDate)} />
              <Content title="Last Hygiene" value={prettyDate(patient.lastHygieneDate)} />
              <Content title="Last Recall" value={prettyDate(patient.lastRecallDate)} />
            </Col>
            <Col xs={6}>
              <Content title="Next Appt" value={prettyDate(patient.nextApptDate)} />
              <Content title="Last Restorative" value={prettyDate(patient.lastRestorativeDate)} />
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

Appointments.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(Appointments);
