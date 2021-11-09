import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import composeSearchQuery from './composeSearchQuery';

const query = gql`
  query fetchPatients_Query(
    $search: SequelizeJSON!
    $limit: Int
    $after: String
    $order: [[String]]
  ) {
    accountViewer {
      id
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

const FetchPatients = ({ children, ...props }) => {
  const queryVariables = composeSearchQuery(props);

  return (
    <Query query={query} variables={queryVariables}>
      {children}
    </Query>
  );
};

FetchPatients.propTypes = { children: PropTypes.func };
FetchPatients.defaultProps = { children: null };

export default FetchPatients;
