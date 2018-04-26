
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query RelayPatientFetcher_Query(
    $search: SequelizeJSON!
    $limit: Int
    $after: String
    $order: [[String]]
  ) {
    accountViewer {
      patients(where: $search, first: $limit, after: $after, order: $order) {
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
    const {
      search,
      limit = 15,
      after,
      order = ['firstName', 'lastName'],
      render,
      ...rest
    } = this.props;

    const splitSearch = search.split(' ').filter(v => v !== '');

    let whereClause = {
      $or: [
        { firstName: { $iLike: `${splitSearch[0]}%` } },
        { lastName: { $iLike: `${splitSearch[0]}%` } },
      ],
    };

    if (splitSearch[1]) {
      whereClause = {
        $and: [
          { firstName: { $iLike: `${splitSearch[0]}%` } },
          { lastName: { $iLike: `${splitSearch[1]}%` } },
        ],
      };
    }

    const queryVariables = {
      search: JSON.stringify(whereClause),
      limit,
      after,
      order,
    };

    return (
      <QueryRenderer
        environment={graphQLEnvironment}
        query={query}
        variables={queryVariables}
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
  order: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ),
  handleSearchRequest: PropTypes.func,
};

export default RelayPatientFetcher;