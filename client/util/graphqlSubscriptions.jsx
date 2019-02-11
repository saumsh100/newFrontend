
import React from 'react';
import AddWaitSpotSubscription from '../components/GraphQLWaitlist/subscriptionAddWaitSpot';
import RemoveWaitSpotSubscription from '../components/GraphQLWaitlist/subscriptionRemoveWaitSpot';

const SubscriptionsList = [AddWaitSpotSubscription, RemoveWaitSpotSubscription];

class GraphQLSubscriptionsManager {
  constructor() {
    this.accountId = null;
  }

  subscriptionComponents() {
    return (
      this.accountId !== null &&
      SubscriptionsList.map((Subscription, index) => (
        <Subscription accountId={this.accountId} key={index} />
      ))
    );
  }
}

export default new GraphQLSubscriptionsManager();
