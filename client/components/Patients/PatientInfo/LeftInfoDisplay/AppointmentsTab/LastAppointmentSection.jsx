
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
      <div className={styles.lastAppointmentHeader}> Last Appointment </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="RECALL" data={validDateValue(patient.lastRecallDate)} />
        </Col>
        <Col xs={6}>
          <InfoDump label="HYGIENE" data={validDateValue(patient.lastHygieneDate)} />
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
