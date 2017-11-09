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
            label="Gender"
            data={patient.gender}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="BIRTHDAY"
            data={moment(patient.birthDate).format('MMMM Do, YYYY')}
          />
        </Col>
      </Row>
      <div className={styles.subHeader}> Contact </div>
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="HOME NUMBER"
            data={patient.homePhoneNumber}
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="MOBILE NUMBER"
            data={patient.mobilePhoneNumber}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="WORK NUMBER"
            data={patient.workPhoneNumber}
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="ADDRESS"
            data={address}
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="LANGUAGE"
            data={patient.language}
          />
        </Col>
      </Row>
    </Grid>
  )
}
