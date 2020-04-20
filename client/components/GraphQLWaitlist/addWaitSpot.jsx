
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { legacyQuery, newQuery } from './fetchWaitSpot';

const mutation = gql`
  mutation addWaitSpot_Mutation($input: addWaitSpotInput!) {
    addWaitSpotMutation(input: $input) {
      waitSpot {
        patientId
        unavailableDays
        availableTimes
        endDate
        daysOfTheWeek
        preferences
      }
    }
  }
`;

const nextMutation = gql`
  mutation addWaitSpot_Mutation($input: addWaitSpotInput!) {
    addWaitSpotMutation(input: $input) {
      waitSpot {
        patientId
        unavailableDays
        availableTimes
        endDate
        note
        duration
        reasonText
        daysOfTheWeek
        preferences
      }
    }
  }
`;

const AddWaitSpot = ({ children, newWaitlist }) => (
  <Mutation
    mutation={newWaitlist ? nextMutation : mutation}
    refetchQueries={() => [
      {
        query: newWaitlist ? newQuery : legacyQuery,
        variables: {},
      },
    ]}
  >
    {children}
  </Mutation>
);

AddWaitSpot.propTypes = { children: PropTypes.func,
  newWaitlist: PropTypes.bool };
AddWaitSpot.defaultProps = { children: null,
  newWaitlist: false };

export default AddWaitSpot;
