import React from 'react';
import { gql } from '@apollo/client';
import { Subscription } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

export const subsQuery = gql`
  subscription subscriptionRemoveWaitSpot_Subscription($accountId: String!) {
    removeWaitSpot(accountId: $accountId) {
      id
    }
  }
`;

const SubscribeToRemoveWaitSpot = ({ accountId }) => (
  <Subscription subscription={subsQuery} variables={{ accountId }} />
);

SubscribeToRemoveWaitSpot.propTypes = { accountId: PropTypes.string.isRequired };
export default SubscribeToRemoveWaitSpot;
