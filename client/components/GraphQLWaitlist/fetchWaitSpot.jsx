
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const query = gql`
  query fetchWaitSpot_Query {
    accountViewer {
      id
      waitSpots {
        edges {
          node {
            availableTimes
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
              cellPhoneNumber
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

export default function FetchWaitSpot({ children }) {
  return <Query query={query}>{children}</Query>;
}

FetchWaitSpot.propTypes = { children: PropTypes.func.isRequired };
