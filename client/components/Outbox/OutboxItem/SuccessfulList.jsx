
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, getFormattedDate } from '../../library';

const getAttrFromPatient = (patient, primaryType) => {
  const attrs = {
    sms: 'mobilePhoneNumber',
    phone: 'mobilePhoneNumber',
    email: 'email',
  };

  return patient[attrs[primaryType]];
};

const SuccessfulList = ({ success, primaryType, timezone, dateFormat, styles }) => (
  <div className={styles.successList}>
    {success.map((patient) => {
      const lastAppt = patient.appointments[patient.appointments.length - 1];
      const lastApptDate = getFormattedDate(lastAppt.startDate, dateFormat, timezone);
      return (
        <Grid className={styles.successItemWrapper}>
          <Row>
            <Col xs={4}>
              {patient.firstName} {patient.lastName}
            </Col>
            <Col xs={4}>{getAttrFromPatient(patient, primaryType)}</Col>
            <Col xs={4}>{lastApptDate}</Col>
          </Row>
        </Grid>
      );
    })}
  </div>
);

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(SuccessfulList);

SuccessfulList.propTypes = {
  success: PropTypes.func.isRequired,
  primaryType: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  styles: PropTypes.shape(PropTypes.any).isRequired,
};
