import React from 'react';
import PropTypes from 'prop-types';
import ReminderEvent from './ReminderEvent';
import RecallEvent from './RecallEvent';
import ReviewEvent from './ReviewEvent';

const getFailedMsg = (data, timezone, eventType, patient) => {
  switch (eventType) {
    case 'recall':
      return <RecallEvent data={data} timezone={timezone} patient={patient} smsFailed />;
    case 'reminder':
      return <ReminderEvent data={data} timezone={timezone} patient={patient} smsFailed />;
    case 'review':
      return <ReviewEvent data={data} timezone={timezone} patient={patient} smsFailed />;
    default:
      return 'SMS failed as number provided does not support SMS';
  }
};

export default function SmsFailEvent({ data, timezone, event, patient }) {
  const eventType = event.get('type');
  return getFailedMsg(data, timezone, eventType, patient);
}

SmsFailEvent.propTypes = {
  timezone: PropTypes.string.isRequired,
  event: PropTypes.objectOf(PropTypes.any).isRequired,
  patient: PropTypes.shape({
    cellPhoneNumber: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    isConfirmed: PropTypes.bool,
    isFamily: PropTypes.bool,
    createdAt: PropTypes.string,
    reminder: PropTypes.shape({ interval: PropTypes.string }),
    primaryType: PropTypes.string,
    sentRemindersPatients: PropTypes.shape({
      sentRemindersId: PropTypes.string,
      appointment: PropTypes.shape({
        id: PropTypes.string,
        startDate: PropTypes.string,
      }),
    }),
  }).isRequired,
};
