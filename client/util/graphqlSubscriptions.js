
import AddWaitSpotSubscription from '../components/RelayWaitlist/subscriptionAddWaitSpot';
import RemoveWaitSpotSubscription from '../components/RelayWaitlist/subscriptionRemoveWaitSpot';

class GraphQLSubscriptionsManager {
  constructor() {
    this.registeredSubscriptions = [];
  }

  initializeSubscription(accountId) {
    this.registeredSubscriptions = this.SubscriptionList.map(subscription =>
      subscription.register(accountId)
    );
  }

  destroySubscriptions() {
    this.registeredSubscriptions.forEach((subscription) => {
      if (subscription.dispose) {
        subscription.dispose();
      }
    });
    this.registeredSubscriptions = [];
  }

  set accountId(accountId) {
    this.destroySubscriptions();
    if (accountId !== null) {
      this.initializeSubscription(accountId);
    }
  }

  get SubscriptionList() {
    return [AddWaitSpotSubscription, RemoveWaitSpotSubscription];
  }
}

export default new GraphQLSubscriptionsManager();
