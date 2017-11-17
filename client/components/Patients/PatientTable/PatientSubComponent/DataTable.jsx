import React, { PropTypes } from 'react';
import moment from 'moment';
import { Grid, Row, Col } from '../../../library';
import InfoDump from '../../PatientInfo/TopDisplay/InfoDump';
import styles from './styles.scss';

export default function DataTable(props) {
  const {
    patient,
  } = props;

  const address = patient && patient.address ? patient.address.street : '';

  return (
    <Grid className={styles.grid}>
      <div className={styles.subHeader}> Basic </div>
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
