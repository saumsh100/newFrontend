
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import EventContainer from './Shared/EventContainer';

export default function NewPatientEvent({ data, timezone }) {
  const createdByText = !data.pmsCreatedAt ? ' by CareCru' : '';
  return (
    <EventContainer
      key={data.id}
      headerData={`${data.firstName} ${data.lastName} was added${createdByText} as a patient on
      ${dateFormatter(data.createdAt, timezone, 'MMMM Do, YYYY')}.`}
    />
  );
}

NewPatientEvent.propTypes = {
  data: PropTypes.shape({
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
