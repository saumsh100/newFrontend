
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { validDateValue } from '../../../Shared/helpers';
import styles from '../styles.scss';

export default function ContinuingCareSection(props) {
  const { patient, className } = props;
  return (
    <div className={className}>
      <div className={styles.lastAppointmentHeader}>Continuing Care</div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="HYGIENE" data={validDateValue(patient.dueForHygieneDate)} />
        </Col>
        <Col xs={6}>
          <InfoDump label="RECALL" data={validDateValue(patient.dueForRecallExamDate)} />
        </Col>
      </Row>
    </div>
  );
}

ContinuingCareSection.propTypes = {
  patient: PropTypes.shape({
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

ContinuingCareSection.defaultProps = {
  className: null,
};
