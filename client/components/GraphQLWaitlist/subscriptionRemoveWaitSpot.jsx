
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';
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
