
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

export const query = gql`
  query fetchPatientSearches_Query($where: SequelizeJSON!) {
    accountViewer {
      id
      accountId
      userId
      patientSearches(where: $where) {
        edges {
          node {
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
    }
  }
`;

const FetchPatientSearches = ({ children, context }) => (
  <Query query={query} variables={{ where: { context } }}>
    {children}
  </Query>
);

FetchPatientSearches.propTypes = {
  children: PropTypes.func,
  context: PropTypes.string,
};

FetchPatientSearches.defaultProps = {
  children: null,
  context: 'hub',
};

export default FetchPatientSearches;
