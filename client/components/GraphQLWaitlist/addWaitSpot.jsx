
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { query } from './fetchWaitSpot';

const mutation = gql`
  mutation addWaitSpot_Mutation($input: addWaitSpotInput!) {
    addWaitSpotMutation(input: $input) {
      waitSpot {
        availableTimes
        id
        ccId
        patientUserId
        appointmentId
        patientId
        reasonText
        note
        duration
        preferences
        unavailableDays
        daysOfTheWeek
        endDate
        createdAt
      }
    }
  }
`;

const AddWaitSpot = ({ children }) => (
  <Mutation
    mutation={mutation}
    refetchQueries={() => [
      {
        query,
        variables: {},
      },
    ]}
  >
    {children}
  </Mutation>
);

AddWaitSpot.propTypes = { children: PropTypes.func };
AddWaitSpot.defaultProps = { children: null };

export default AddWaitSpot;
