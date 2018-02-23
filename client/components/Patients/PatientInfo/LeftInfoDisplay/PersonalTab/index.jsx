import React, { PropTypes } from 'react';
import moment from 'moment';
import { Grid, Row, Col, Icon } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { formatPhoneNumber } from '../../../../library/util/Formatters';
import styles from '../styles.scss';

export default function PersonalTab(props) {
  const {
    patient,
  } = props;

  const componentAddress = patient && patient.address && Object.keys(patient.address).length ? (<div className={styles.text}>
    <div>{patient.address.street} </div>
    <div>{patient.address.country} </div>
    <div>{patient.address.state} </div>
    <div>{patient.address.zipCode} </div>
  </div>
  ) : null;

  return (
    <Grid className={styles.grid}>
      <div className={styles.subHeader}> Basic </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="GENDER"
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
            data={formatPhoneNumber(patient.homePhoneNumber)}
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="MOBILE NUMBER"
            data={formatPhoneNumber(patient.mobilePhoneNumber)}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="WORK NUMBER"
            data={formatPhoneNumber(patient.workPhoneNumber)}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="EMAIL"
            data={patient.email}
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} >
          <InfoDump
            label="ADDRESS"
            component={componentAddress}
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

PersonalTab.propTypes = {
  patient: PropTypes.object.isRequired,
};
