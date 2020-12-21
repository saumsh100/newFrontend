
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import RequestEventContainer from './Shared/RequestEventContainer';
import getEventText from './Shared/textBuilder';

export default function RequestEvent({ data, timezone }) {
  const eventTextKey = data.isCancelled ? 'rejected' : 'confirmed';
  return (
    <RequestEventContainer
      key={data.id}
      data={data}
      headerData={`${getEventText('english', 'requests', eventTextKey)} ${dateFormatter(
        data.startDate,
        timezone,
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
    isCancelled: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
