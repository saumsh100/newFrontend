import React, { PropTypes } from 'react';
import { Grid, Row, Col } from '../../../../library';
import InfoDump from '../../TopDisplay/InfoDump';
import styles from '../styles.scss';

export default function AppointmentsTab(props) {
  return (
    <Grid className={styles.grid}>
      <div className={styles.subHeader}> Last Appointment </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="RECALL"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
          />
        </Col>
      </Row>
      <div className={styles.subHeader}> Continuing Care </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="RECALL"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
          />
        </Col>
      </Row>
      <div className={styles.subHeader}> Other </div>
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST X-RAY"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RESTORATIVE VISIT"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RECALL VISIT"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="TOTAL RECALL VISITS"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="LAST HYGIENE VIST"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="TOTAL HYGIENCE VISTS"
          />
        </Col>
      </Row>
    </Grid>
  )
}
