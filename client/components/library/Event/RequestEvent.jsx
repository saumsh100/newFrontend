
import React from 'react';
import PropTypes from 'prop-types';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';

export default function RequestEvent({ data }) {
  const eventTextKey = data.isCancelled ? 'rejected' : 'confirmed';
  return (
    <EventContainer
      key={data.id}
      headerData={`${getEventText('english', 'requests', eventTextKey)} ${dateFormatter(
        data.startDate,
        '',
        'MMMM Do, YYYY h:mma',
      )}`}
      subHeaderItalicData={data.note || ''}
    />
  );
}

RequestEvent.propTypes = {
  data: PropTypes.shape({
    startDate: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
};
