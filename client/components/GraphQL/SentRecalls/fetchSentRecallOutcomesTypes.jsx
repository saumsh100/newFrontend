import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

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
