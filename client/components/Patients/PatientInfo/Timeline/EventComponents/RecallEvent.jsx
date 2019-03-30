
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import EventContainer from './Shared/EventContainer';
import ManualRecallEvent from './ManualRecallEvent';
import getEventText from './Shared/textBuilder';

const contactMethodHash = {
  email: 'SMS',
  sms: 'Email',
  'sms/email': 'Email & SMS',
};

const recallIntervalHash = {
  '1 months': '1 Month Before',
  '1 weeks': '1 Week Before',
  '-1 weeks': '1 Week After',
  '-1 months': '1 Month After',
  '-2 months': '2 Months After',
  '-4 months': '4 Months After',
  '-6 months': '6 Months After',
  '-8 months': '8 Months After',
  '-10 months': '10 Months After',
  '-12 months': '12 Months After',
  '-14 months': '14 Months After',
  '-16 months': '16 Months After',
  '-18 months': '18 Months After',
};

export default function RecallEvent({ data }) {
  if (!data.isAutomated) return <ManualRecallEvent data={data} />;

  const sentDate = dateFormatter(data.createdAt, '', 'MMMM Do, YYYY h:mma');
  const typeOfRecall = data.isHygiene ? 'hygiene' : 'recall';
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
    createdAt: PropTypes.string,
    isHygiene: PropTypes.bool,
    isAutomated: PropTypes.bool,
    primaryType: PropTypes.string,
    recall: PropTypes.shape({ interval: PropTypes.string }),
  }).isRequired,
};
