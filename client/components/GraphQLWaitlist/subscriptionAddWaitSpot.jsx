
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';
import PropTypes from 'prop-types';
import DesktopNotification from '../../util/desktopNotification';

export const subsQuery = gql`
  subscription subscriptionAddWaitSpot_Subscription($accountId: String!) {
    newWaitSpot(accountId: $accountId) {
      id
      ccId
      availableTimes
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
`;

const SubscribeToNewWaitSpot = ({ accountId }) => (
  <Subscription subscription={subsQuery} variables={{ accountId }}>
    {({ data }) => {
      if (!data) {
        return null;
      }
      const { newWaitSpot } = data;
      const patient = newWaitSpot.patient || newWaitSpot.patientUser;
      const fullName = `${patient.firstName} ${patient.lastName}`;
      const messageHeading = 'New wait spot request';
      DesktopNotification.showNotification(messageHeading, { body: `New wait spot request by ${fullName}.` });
      return null;
    }}
  </Subscription>
);

SubscribeToNewWaitSpot.propTypes = { accountId: PropTypes.string.isRequired };
export default SubscribeToNewWaitSpot;
