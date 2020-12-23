
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col, isDateValid, getFormattedDate } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { patientShape } from '../../../../library/PropTypeShapes';
import ContactSection from './ContactSection';
import styles from '../styles.scss';

function PersonalTab({ patient, timezone }) {
  const componentAddress = patient && patient.address && Object.keys(patient.address).length && (
    <div className={styles.text}>
      <div>{patient.address.street} </div>
      <div>{patient.address.country} </div>
      <div>{patient.address.state} </div>
      <div>{patient.address.zipCode} </div>
    </div>
  );

  const birthDateData = isDateValid(patient.birthDate)
    && getFormattedDate(patient.birthDate, 'MMMM Do, YYYY', timezone);

  return (
    <Grid className={styles.grid}>
      <div className={styles.subHeader}>Basic</div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="GENDER" data={patient.gender} />
        </Col>
        <Col xs={6}>
          <InfoDump label="BIRTHDAY" data={birthDateData} />
        </Col>
      </Row>
      <ContactSection patient={patient} className={styles.sectionWrapper} />
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="ADDRESS" component={componentAddress} />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="LANGUAGE" data={patient.language} />
        </Col>
      </Row>
    </Grid>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(PersonalTab);

PersonalTab.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};
