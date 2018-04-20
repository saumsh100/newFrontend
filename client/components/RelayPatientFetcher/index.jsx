
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';

import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query RelayPatientFetcher_Query($search: SequelizeJSON!, $limit: Int, $after: String) {
    accountViewer {
      patients(where: $search, first: $limit, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
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
  }
`;

class RelayPatientFetcher extends Component {
  constructor(props) {
    super(props);
    this.props.handleSearchRequest(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.props.search) {
      this.props.handleSearchRequest(nextProps);
    }
  }

  render() {
    const { search, limit = 15, after, render, ...rest } = this.props;
    return (
      <QueryRenderer
        environment={graphQLEnvironment}
        query={query}
        variables={{
          search: JSON.stringify({ firstName: { ilike: `${search}%` } }),
          limit,
          after,
        }}
        render={relayProps => render(Object.assign(rest, relayProps))}
      />
    );
  }
}

RelayPatientFetcher.propTypes = {
  search: PropTypes.string,
  limit: PropTypes.number,
  render: PropTypes.func.isRequired,
  after: PropTypes.string,
  handleSearchRequest: PropTypes.func,
};

export default RelayPatientFetcher;
