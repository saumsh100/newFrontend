
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import { getFormattedDate } from '../../../../library';

export default function NewPatientEvent({ data, timezone }) {
  const createdByText = !data.pmsCreatedAt ? ' by CareCru' : '';
  return (
    <EventContainer
      key={data.id}
      headerData={`${data.firstName} ${data.lastName} was added${createdByText} as a patient on
      ${getFormattedDate(data.createdAt, 'MMMM Do, YYYY', timezone)}.`}
    />
  );
}

NewPatientEvent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    pmsCreatedAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
