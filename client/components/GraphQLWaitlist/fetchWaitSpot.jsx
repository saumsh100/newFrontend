
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const newQuery = gql`
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
            appointmentId
            patientId
            reasonText
            note
            duration
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
              birthDate
              gender
              phoneNumber
              email
            }
          }
        }
      }
    }
  }
`;

export const legacyQuery = gql`
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

export default function FetchWaitSpot({ newWaitlist, children }) {
  return <Query query={newWaitlist ? newQuery : legacyQuery}>{children}</Query>;
}

FetchWaitSpot.propTypes = {
  children: PropTypes.func.isRequired,
  newWaitlist: PropTypes.bool.isRequired,
};
