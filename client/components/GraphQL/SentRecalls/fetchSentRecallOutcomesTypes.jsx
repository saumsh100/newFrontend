
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

const query = gql`
  query fetchSentRecallOutcomes_NEST {
    sentRecallOutcomes(sentRecallOutcomesReadInput: { isDeprecated: false }) {
      value: id
      label: name
    }
  }
`;

const FetchOutcomeTypes = ({ children }) => <Query query={query}>{children}</Query>;

FetchOutcomeTypes.propTypes = {
  children: PropTypes.func,
};

FetchOutcomeTypes.defaultProps = {
  children: null,
};

export default FetchOutcomeTypes;
