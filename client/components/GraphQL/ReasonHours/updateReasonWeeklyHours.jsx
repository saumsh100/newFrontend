import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const mutation = gql`
  mutation updateReasonWeeklyHours_NEST(
    $id: ID!
    $isClosed: Boolean!
    $availabilities: [TimeSlotInput]!
    $breaks: [TimeSlotInput]!
  ) {
    updateReasonDailyHours(
      reasonDailyHoursUpdateInput: {
        id: $id
        isClosed: $isClosed
        availabilities: $availabilities
        breaks: $breaks
      }
    ) {
      id
    }
  }
`;

const UpdateReasonWeeklyHours = ({ children, ...props }) => (
  <Mutation mutation={mutation} {...props} refetchQueries={['fetchReasonWeeklyHours_NEST']}>
    {children}
  </Mutation>
);

UpdateReasonWeeklyHours.propTypes = {
  children: PropTypes.func,
  id: PropTypes.string,
};

UpdateReasonWeeklyHours.defaultProps = {
  children: null,
  id: null,
};

export default UpdateReasonWeeklyHours;
