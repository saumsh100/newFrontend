
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { legacyQuery } from './fetchWaitSpot';

const mutation = gql`
  mutation deleteWaitSpot_Mutation($input: deleteWaitSpotInput!) {
    deleteWaitSpotMutation(input: $input) {
      clientMutationId
      waitSpot {
        id
      }
    }
  }
`;

const DeleteWaitSpot = ({ children }) => (
  <Mutation
    mutation={mutation}
    refetchQueries={() => [
      {
        query: legacyQuery,
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
