import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import { query } from './fetchPatientSearches';

const mutation = gql`
  mutation addPatientSearch_Mutation($input: addPatientSearchesInput!) {
    addPatientSearchesMutation(input: $input) {
      patientSearch {
        context
        patient {
          id
          ccId
          pmsId
          avatarUrl
          firstName
          lastName
          birthDate
          lastApptDate
        }
      }
    }
  }
`;

const AddPatientSearchMutation = ({ children }) => (
  <Mutation
    mutation={mutation}
    refetchQueries={({
      data: {
        addPatientSearchesMutation: {
          patientSearch: { context },
        },
      },
    }) => [
      {
        query,
        variables: { where: { context } },
      },
    ]}
  >
    {children}
  </Mutation>
);

AddPatientSearchMutation.propTypes = { children: PropTypes.func };
AddPatientSearchMutation.defaultProps = { children: null };

export default AddPatientSearchMutation;
