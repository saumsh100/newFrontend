
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

const query = gql`
  query fetchFollowUpTypes_NEST {
    patientFollowUpTypes(patientFollowUpTypesReadInput: { isDeprecated: false }) {
      value: id
      label: name
    }
  }
`;

const FetchFollowUpTypes = ({ children }) => <Query fetchPolicy='cache-and-network' query={query}>{children}</Query>;

FetchFollowUpTypes.propTypes = {
  children: PropTypes.func,
};

FetchFollowUpTypes.defaultProps = {
  children: null,
};

export default FetchFollowUpTypes;
