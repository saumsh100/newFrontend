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

export default function FetchWaitSpot({ children }) {
  return <Query query={query}>{children}</Query>;
}

FetchWaitSpot.propTypes = {
  children: PropTypes.func.isRequired,
};
