
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function ReminderEvent(props) {
  const {
    data,
  } = props;

  return (
    <div className={styles.body}>
      <div className={styles.body_subHeader}>
        Reminder Sent: For appointment on {moment(data.appointmentStartDate).format('MMMM Do, YYYY h:mma')}
      </div>
    </div>
  );
}

ReminderEvent.propTypes = {
  data: PropTypes.object,
};
