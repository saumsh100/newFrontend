
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query RelayFetchWaitlist_Query {
    accountViewer {
      id
      waitSpots @connection(key: "WaitSpots") {
        edges {
          node {
            id
            ccIdd
            patientUserId
            patientId
            preferences
            unavailableDays
            daysOfTheWeek
            endDate
            createdAt
            patient {
              id
              ccId
              firstName
              lastName
              phoneNumber
              mobilePhoneNumber
              email
              birthDate
              gender
              nextApptDate
              lastApptDate
            }
            patientUser {
              id
              firstName
              lastName
              phoneNumber
              email
              gender
            }
          }
        }
      }
    }
  }
`;

function RelayFetchWaitlist(props) {
  const { render, ...rest } = props;

  return (
    <QueryRenderer
      environment={graphQLEnvironment}
      query={query}
      render={relayProps => render(Object.assign(rest, relayProps))}
    />
  );
}

RelayFetchWaitlist.propTypes = {
  search: PropTypes.string,
  limit: PropTypes.number,
  after: PropTypes.string,
  order: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ),
  handleSearchRequest: PropTypes.func,
  render: PropTypes.func.isRequired,
};

export default RelayFetchWaitlist;
