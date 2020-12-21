
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';

export default function AppointmentEvent({ data, timezone }) {
  const { isCancelled, startDate } = data;

  const completedApp = startDate < new Date().toISOString() ? 'completed' : 'booked';
  const eventTextKey = isCancelled ? 'cancelled' : completedApp;

  const appDate = dateFormatter(startDate, timezone, 'MMMM Do, YYYY h:mma');

  const headerData = getEventText('english', 'appointments', eventTextKey)({ appDate });

  return (
    <EventContainer key={data.id} headerData={headerData} subHeaderItalicData={data.note || ''} />
  );
}

AppointmentEvent.propTypes = {
  data: PropTypes.shape({
    startDate: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
