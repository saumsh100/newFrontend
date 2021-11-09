import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

const query = gql`
  query fetchFollowUpTypes_NEST {
    patientFollowUpTypes(patientFollowUpTypesReadInput: { isDeprecated: false }) {
      value: id
      label: name
    }
  }
`;

const FetchFollowUpTypes = ({ children }) => (
  <Query fetchPolicy="cache-and-network" query={query}>
    {children}
  </Query>
);

FetchFollowUpTypes.propTypes = {
  children: PropTypes.func,
};

FetchFollowUpTypes.defaultProps = {
  children: null,
};

export default FetchFollowUpTypes;
