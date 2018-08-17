
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import styles from './styles.scss';

export default function ReminderEvent({ data }) {
  const appDate = dateFormatter(data.appointment.startDate, '', 'MMMM Do, YYYY h:mma');

  const contactMethodHash = {
    email: 'SMS',
    sms: 'Email',
    'sms/email': 'Email & SMS',
  };

  const contactMethod = contactMethodHash[data.primaryType];
  const intervalText = <span className={styles.reminder_interval}>{data.reminder.interval}</span>;

  const component = (
    <div className={styles.body_header}>
      Sent {"'"}
      {intervalText} Before{"'"} {contactMethod} Reminder for the appointment on {appDate}
    </div>
  );

  return <EventContainer key={data.id} component={component} />;
}

ReminderEvent.propTypes = { data: PropTypes.shape({ appointmentStartDate: PropTypes.string }).isRequired };
