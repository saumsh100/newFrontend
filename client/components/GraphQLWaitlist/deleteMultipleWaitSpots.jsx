
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
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
