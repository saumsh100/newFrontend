import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from '../../../../library';
import patientShape from '../../../../library/PropTypeShapes/patient';
import InfoDump from '../../../Shared/InfoDump';
import { validDateValue } from '../../../Shared/helpers';
import styles from '../styles.scss';

const LastAppointmentSection = ({ patient, className, timezone }) => (
  <div className={className}>
    <div className={styles.lastAppointmentHeader}>Last Appointment</div>
    <Row className={styles.appointmentsRow}>
      <Col xs={6}>
        <InfoDump label="Hygiene" data={validDateValue(patient.lastHygieneDate, timezone)} />
      </Col>
      <Col xs={6}>
        <InfoDump label="Recall" data={validDateValue(patient.lastRecallDate, timezone)} />
      </Col>
    </Row>
    <Row className={styles.appointmentsRow}>
      <Col xs={6}>
        <InfoDump
          label="Restorative"
          data={validDateValue(patient.lastRestorativeDate, timezone)}
        />
      </Col>
    </Row>
  </div>
);

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(LastAppointmentSection);

LastAppointmentSection.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  className: PropTypes.string,
  timezone: PropTypes.string.isRequired,
};

LastAppointmentSection.defaultProps = {
  className: null,
};
