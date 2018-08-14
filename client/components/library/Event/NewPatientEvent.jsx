
import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';

export default function NewPatientEvent({ data }) {
  const createdByText = !data.pmsCreatedAt ? ' by CareCru' : '';
  return (
    <EventContainer
      key={data.id}
      headerData={`${data.firstName} ${data.lastName} was added${createdByText} as a patient on
      ${dateFormatter(data.createdAt, '', 'MMMM Do, YYYY')}.`}
    />
  );
}

NewPatientEvent.propTypes = {
  data: PropTypes.shape({
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};
