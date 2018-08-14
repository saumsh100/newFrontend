
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import getEventText from './Shared/textBuilder';

export default function RecallEvent({ data }) {
  const typeOfRecall = data.isHygiene ? 'hygiene' : 'recall';

  const sentDate = dateFormatter(data.createdAt, '', 'MMMM Do, YYYY h:mma');

  const contactMethodHash = {
    email: 'SMS',
    sms: 'Email',
    'sms/email': 'Email & SMS',
  };

  const recallIntervalHash = {
    '1 months': '1 month before',
    '1 weeks': '1 week before',
    '-1 weeks': '1 week after',
    '-1 months': '1 month after',
    '-2 months': '2 months after',
    '-4 months': '4 months after',
    '-6 months': '6 months after',
    '-8 months': '8 months after',
    '-10 months': '10 months after',
    '-12 months': '12 months after',
    '-14 months': '14 months after',
    '-16 months': '16 months after',
    '-18 months': '18 months after',
  };

  const intervalText = recallIntervalHash[data.recall.interval];
  const contactMethod = contactMethodHash[data.primaryType];

  const headerData = getEventText('english', 'recalls', typeOfRecall)({
    intervalText,
    contactMethod,
    sentDate,
  });

  return <EventContainer key={data.id} headerData={headerData} />;
}

RecallEvent.propTypes = {
  data: PropTypes.shape({
    appointmentStartDate: PropTypes.string,
  }).isRequired,
};
