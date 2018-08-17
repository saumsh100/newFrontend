
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

  const reminderIntervalHash = {
    '21 days': '21 Days',
    '7 days': '7 Days',
    '2 days': '2 Days',
    '2 hours': '2 Hours',
  };

  const contactMethod = contactMethodHash[data.primaryType];
  const intervalText = data.reminder.interval;

  const headerData = getEventText('english', 'reminders', 'default')({
    contactMethod,
    intervalText: reminderIntervalHash[intervalText],
    appDate,
  });

  return <EventContainer key={data.id} headerData={headerData} />;
}

ReminderEvent.propTypes = { data: PropTypes.shape({ appointmentStartDate: PropTypes.string }).isRequired };
