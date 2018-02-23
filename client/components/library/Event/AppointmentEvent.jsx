
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import styles from './styles.scss';

export default function AppointmentEvent(props) {
  const {
    data,
    bodyStyle,
  } = props;

  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>
        Appointment booked on {moment(data.startDate).format('MMMM Do, YYYY h:mma')}
      </div>
      <div className={styles.body_subHeaderItalic}>
        {data.note || '' }
      </div>
    </div>
  );
}

AppointmentEvent.propTypes = {
  data: PropTypes.object,
  bodyStyle: PropTypes.object,
};
