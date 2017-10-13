import React, { PropTypes } from 'react';
import { Grid, Row, Col } from '../../../../library';
import InfoDump from '../../TopDisplay/InfoDump';
import styles from '../styles.scss';

export default function AppointmentsTab(props) {
  return (
    <Grid className={styles.grid}>
      <div className={styles.header}> Last Appointment </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="RECALL"
            data="March 21,2017"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
            data="OCT 16,2017"
          />
        </Col>
      </Row>
      <div className={styles.header}> Continuing Care </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="RECALL"
            data="9 Months"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
            data="6 Months"
          />
        </Col>
      </Row>
      <div className={styles.header}> Other </div>
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST X-RAY"
            data="March 21,2017"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RESTORATIVE VISIT"
            data="OCT 16,2017"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RECALL VISIT"
            data="March 21,2017"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="TOTAL RECALL VISITS"
            data="OCT 16,2017"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="LAST HYGIENE VIST"
            data="March 21,2017"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="TOTAL HYGIENCE VISTS"
            data="OCT 16,2017"
          />
        </Col>
      </Row>
    </Grid>
  )
}
