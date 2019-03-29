
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import styles from '../styles.scss';
import { validDateValue } from '../../../Shared/helpers';

export default function AppointmentsTab(props) {
  const { patient } = props;

  return (
    <Grid className={styles.grid}>
      <div className={styles.lastAppointmentHeader}> Last Appointment </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="RECALL" data={validDateValue(patient.lastRecallDate)} />
        </Col>
        <Col xs={6}>
          <InfoDump label="HYGIENE" data={validDateValue(patient.lastHygieneDate)} />
        </Col>
      </Row>
      <div className={styles.subHeader}> Continuing Care </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="RECALL" />
        </Col>
        <Col xs={6}>
          <InfoDump label="HYGIENE" />
        </Col>
      </Row>
      <div className={styles.subHeader}> Other </div>
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="LAST X-RAY" />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RESTORATIVE VISIT"
            data={validDateValue(patient.lastRestorativeDate)}
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="LAST RECALL VISIT" />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="TOTAL RECALL VISITS" />
        </Col>
        <Col xs={6}>
          <InfoDump label="LAST HYGIENE VISIT" />
        </Col>
        <Col xs={6}>
          <InfoDump label="TOTAL HYGIENCE VISITS" />
        </Col>
      </Row>
    </Grid>
  );
}

AppointmentsTab.propTypes = {
  patient: PropTypes.shape({
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }).isRequired,
};
