
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query fetchWaitSpot_Query {
    accountViewer {
      id
      waitSpots(
        first: 2147483647 # MaxGraphQL Int
      ) @connection(key: "AccountViewer_waitSpots") {
        edges {
          node {
            id
            ccId
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
              address
            }
            patientUser {
              id
              ccId
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

export default function FetchWaitSpot(props) {
  const { render, ...rest } = props;

  return (
    <QueryRenderer
      environment={graphQLEnvironment}
      query={query}
      render={relayProps => render(Object.assign(rest, relayProps))}
    />
  );
}

FetchWaitSpot.propTypes = {
  render: PropTypes.func.isRequired,
};
