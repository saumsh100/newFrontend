import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { query } from './fetchWaitSpot';

const mutation = gql`
  mutation deleteMultipleWaitSpots_Mutation($input: deleteMultipleWaitSpotsInput!) {
    deleteMultipleWaitSpotsMutation(input: $input) {
      clientMutationId
    }
  }
`;

const DeleteWaitSpot = ({ children }) => (
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

DeleteWaitSpot.propTypes = { children: PropTypes.func };
DeleteWaitSpot.defaultProps = { children: null };

export default DeleteWaitSpot;
