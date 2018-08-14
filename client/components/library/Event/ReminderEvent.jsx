
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import getEventText from './Shared/textBuilder';

export default function ReminderEvent({ data }) {
  const appDate = dateFormatter(data.appointment.startDate, '', 'MMMM Do, YYYY h:mma');

  const contactMethodHash = {
    email: 'SMS',
    sms: 'Email',
    'sms/email': 'Email & SMS',
  };

  const contactMethod = contactMethodHash[data.primaryType];
  const intervalText = data.reminder.interval;

  const headerData = getEventText('english', 'reminders', 'default')({
    contactMethod,
    intervalText,
    appDate,
  });

  return <EventContainer key={data.id} headerData={headerData} />;
}

ReminderEvent.propTypes = {
  data: PropTypes.shape({
    appointmentStartDate: PropTypes.string,
  }).isRequired,
};
