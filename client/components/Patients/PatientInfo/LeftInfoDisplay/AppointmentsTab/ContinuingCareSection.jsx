import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from '../../../../library';
import patientShape from '../../../../library/PropTypeShapes/patient';
import InfoDump from '../../../Shared/InfoDump';
import { validDateValue } from '../../../Shared/helpers';
import styles from '../styles.scss';

const ContinuingCareSection = ({ patient, className, timezone }) => (
  <div className={className}>
    <div className={styles.lastAppointmentHeader}>Continuing Care</div>
    <Row className={styles.row}>
      <Col xs={6}>
        <InfoDump label="Hygiene" data={validDateValue(patient.dueForHygieneDate, timezone)} />
      </Col>
      <Col xs={6}>
        <InfoDump label="Recall" data={validDateValue(patient.dueForRecallExamDate, timezone)} />
      </Col>
    </Row>
  </div>
);

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(ContinuingCareSection);

ContinuingCareSection.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  className: PropTypes.string,
  timezone: PropTypes.string.isRequired,
};

ContinuingCareSection.defaultProps = {
  className: null,
};
