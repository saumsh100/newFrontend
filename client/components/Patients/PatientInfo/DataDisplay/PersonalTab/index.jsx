import React, { PropTypes } from 'react';
import { Grid, Row, Col } from '../../../../library';
import InfoDump from '../../TopDisplay/InfoDump';
import styles from '../styles.scss';

export default function PersonalTab(props) {
  return (
    <Grid className={styles.grid}>
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
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="RECALL"
            data="9 Months"
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="HYGIENE"
            data="6 Months"
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
            data="6 Months"
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="LAST X-RAY"
            data="March 21,2017"
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="LANGUAGE"
            data="English"
          />
        </Col>
      </Row>
    </Grid>
  )
}
