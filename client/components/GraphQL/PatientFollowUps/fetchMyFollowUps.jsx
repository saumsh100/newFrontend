
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export const fetchMyFollowUpsQuery = gql`
  query fetchMyFollowUps_NEST($accountId: String!, $assignedUserId: String!, $timezone: String!) {
    patientFollowUps(
      patientFollowUpsReadInput: {
        accountId: $accountId
        assignedUserId: $assignedUserId
        timezone: $timezone
        isWithinPast30Days: true
        isCompleted: false
      }
    ) {
      id
      patientId
    }
  }
`;

export default function FetchMyFollowUps({ children, variables }) {
  return (
    <Query query={fetchMyFollowUpsQuery} variables={variables} pollInterval={10000}>
      {children}
    </Query>
  );
}

FetchMyFollowUps.propTypes = {
  children: PropTypes.func.isRequired,
  variables: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    assignedUserId: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired,
};
