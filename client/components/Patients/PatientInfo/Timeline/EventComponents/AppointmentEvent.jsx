
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';
import { getFormattedDate } from '../../../../library';

export default function AppointmentEvent({ data, timezone }) {
  const { isCancelled, startDate } = data;

  const completedApp = startDate < new Date().toISOString() ? 'completed' : 'booked';
  const eventTextKey = isCancelled ? 'cancelled' : completedApp;

  const appDate = getFormattedDate(startDate, 'MMMM Do, YYYY h:mma', timezone);

  const headerData = getEventText('english', 'appointments', eventTextKey)({ appDate });

  return (
    <EventContainer key={data.id} headerData={headerData} subHeaderItalicData={data.note || ''} />
  );
}

AppointmentEvent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    startDate: PropTypes.string,
    note: PropTypes.string,
    isCancelled: PropTypes.bool,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
