
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function ReminderEvent(props) {
  const { data, bodyStyle } = props;
  console.log(data);
  return (
    <div className={bodyStyle}>
      <div className={styles.body_subHeader}>
        Reminder Sent: For appointment on{' '}
        {moment(data.appointmentStartDate).format('MMMM Do, YYYY h:mma')}
      </div>
    </div>
  );
}

ReminderEvent.propTypes = {
  data: PropTypes.object,
  bodyStyle: PropTypes.object,
};
