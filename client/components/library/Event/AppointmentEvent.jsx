import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function AppointmentEvent(props) {
  const {
    data,
  } = props;

  return (
    <div className={styles.body}>
      <div className={styles.body_header}>
        Appointment Booked on {moment(data.startDate).format('MMMM Do, YYYY h:mma')}
      </div>
      <div className={styles.body_subHeaderItalic}>
        {data.note || '' }
      </div>
    </div>
  );
}

AppointmentEvent.propTypes = {
  data: PropTypes.object,
};
