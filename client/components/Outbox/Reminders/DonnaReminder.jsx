
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Grid, Row, Col, getFormattedDate } from '../../library';
import PatientShape from '../../library/PropTypeShapes/patient';

const ReminderListItem = ({ data, timezone }) => {
  const { patient, primaryTypes, sendDate } = data;
  const { appointment } = patient;
  return (
    <ListItem>
      <Grid>
        <Row>
          <Col xs={3}>{primaryTypes.join('&')}</Col>
          <Col xs={3}>{getFormattedDate(sendDate, 'h:mma', timezone)}</Col>
          <Col xs={3}>{`${patient.firstName} ${patient.lastName}`}</Col>
          <Col xs={3}>
            {getFormattedDate(appointment.startDate, 'dddd, MMMM Do h:mma', timezone)}
          </Col>
        </Row>
      </Grid>
    </ListItem>
  );
};

ReminderListItem.propTypes = {
  data: PropTypes.shape({
    primaryTypes: PropTypes.arrayOf(PropTypes.string),
    sendDate: PropTypes.string,
    patient: PropTypes.shape(PatientShape),
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(ReminderListItem);
