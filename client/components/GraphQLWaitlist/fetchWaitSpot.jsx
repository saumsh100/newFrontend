import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
            practitioner {
              id
              ccId
              accountId
              type
              isActive
              isHidden
              firstName
              lastName
            }
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
              isPhoneNumberAvailable
              isSMSEnabled
              isVoiceEnabled
              phoneNumberType
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

export default function FetchWaitSpot({ children, isRefetch }) {
  return (
    <Query query={query} fetchPolicy="cache-and-network" pollInterval={isRefetch && 500}>
      {children}
    </Query>
  );
}

FetchWaitSpot.propTypes = {
  children: PropTypes.func.isRequired,
  isRefetch: PropTypes.bool.isRequired,
};
