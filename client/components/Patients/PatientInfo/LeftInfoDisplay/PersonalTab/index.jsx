import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col, isDateValid, getFormattedDate, Divider } from '../../../../library';
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

  const birthDateData =
    isDateValid(patient.birthDate) &&
    getFormattedDate(patient.birthDate, 'MMMM Do, YYYY', timezone);

  return (
    <Grid className={styles.grid}>
      <div className={styles.subHeader}>Basic</div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="Gender" data={patient.gender} />
        </Col>
        <Col xs={6}>
          <InfoDump label="Birthday" data={birthDateData} />
        </Col>
      </Row>
      <Divider className={styles.divider} />
      <ContactSection patient={patient} className={styles.sectionWrapper} />
      <Row>
        <Col xs={6}>
          <InfoDump label="Address" component={componentAddress} />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <InfoDump label="Language" data={patient.language} className={styles.langugae} />
        </Col>
      </Row>
    </Grid>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(PersonalTab);

PersonalTab.propTypes = {
  patient: PropTypes.shape(patientShape),
  timezone: PropTypes.string.isRequired,
};

PersonalTab.defaultProps = {
  patient: {},
};
