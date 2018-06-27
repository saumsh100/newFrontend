
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from '../styles.scss';

export default function AppointmentData(props) {
  const { appointment } = props;

  return (
    <div className={styles.appData}>
      <div className={styles.appData_startDate}>
        {moment(appointment.startDate).format('h:mm A')}
      </div>
      <div className={styles.appData_endDate}>
        {moment(appointment.endDate).format('h:mm A')}
      </div>
    </div>
  );
}

AppointmentData.propTypes = {
  appointment: PropTypes.object,
};
