import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { query } from './fetchWaitSpot';

const mutation = gql`
  mutation updateWaitSpot_Mutation($input: updateWaitSpotInput!) {
    updateWaitSpot(input: $input) {
      waitSpot {
        ccId
      }
    }
  }
`;

const UpdateWaitSpot = ({ children }) => (
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

UpdateWaitSpot.propTypes = { children: PropTypes.func };
UpdateWaitSpot.defaultProps = { children: null };

export default UpdateWaitSpot;
