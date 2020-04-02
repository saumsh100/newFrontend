
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { validDateValue } from '../../../Shared/helpers';
import styles from '../styles.scss';

export default function LastAppointmentSection(props) {
  const { patient, className } = props;
  return (
    <div className={className}>
      <div className={styles.lastAppointmentHeader}>Last Appointment</div>
      <Row className={styles.appointmentsRow}>
        <Col xs={6}>
          <InfoDump label="HYGIENE" data={validDateValue(patient.lastHygieneDate)} />
        </Col>
        <Col xs={6}>
          <InfoDump label="RECALL" data={validDateValue(patient.lastRecallDate)} />
        </Col>
      </Row>
      <Row className={styles.appointmentsRow}>
        <Col xs={6}>
          <InfoDump label="RESTORATIVE" data={validDateValue(patient.lastRestorativeDate)} />
        </Col>
      </Row>
    </div>
  );
}

LastAppointmentSection.propTypes = {
  patient: PropTypes.shape({
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

LastAppointmentSection.defaultProps = {
  className: null,
};
