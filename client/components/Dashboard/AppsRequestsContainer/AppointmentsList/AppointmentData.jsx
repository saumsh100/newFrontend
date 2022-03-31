import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormattedDate } from '../../../library';
import styles from '../../styles';
import { appointmentShape } from '../../../library/PropTypeShapes';

function AppointmentData(props) {
  const { appointment, timezone } = props;
  return (
    <div className={styles.appRequestContainer_appData}>
      <div className={styles.appRequestContainer_appData_startDate}>
        {getFormattedDate(appointment.startDate, 'h:mm A', timezone)}
      </div>
      <div>{getFormattedDate(appointment.endDate, 'h:mm A', timezone)}</div>
    </div>
  );
}

AppointmentData.propTypes = {
  appointment: PropTypes.shape(appointmentShape),
  timezone: PropTypes.string.isRequired,
};

AppointmentData.defaultProps = {
  appointment: null,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(AppointmentData);
