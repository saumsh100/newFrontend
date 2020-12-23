
import React from 'react';
import PropTypes from 'prop-types';
import RequestEventContainer from './Shared/RequestEventContainer';
import getEventText from './Shared/textBuilder';
import { getFormattedDate } from '../../../../library';

export default function RequestEvent({ data, timezone }) {
  const eventTextKey = data.isCancelled ? 'rejected' : 'confirmed';
  return (
    <RequestEventContainer
      key={data.id}
      data={data}
      headerData={`${getEventText('english', 'requests', eventTextKey)} ${getFormattedDate(
        data.startDate,
        'MMMM Do, YYYY h:mma',
        timezone,
      )}`}
      subHeaderItalicData={data.note || ''}
    />
  );
}

RequestEvent.propTypes = {
  data: PropTypes.shape({
    startDate: PropTypes.string,
    note: PropTypes.string,
    isCancelled: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
