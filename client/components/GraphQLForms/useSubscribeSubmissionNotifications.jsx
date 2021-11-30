import { useSubscription } from '@apollo/client';
import { subscribeSubmissionNotifications } from '../GraphQL/FormNotifications/SubscribeNotifications';

import { formsClient } from './clientConfig';

const useSubscriptionNotification = () => {
  return useSubscription(subscribeSubmissionNotifications, {
    client: formsClient,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { useSubscriptionNotification };
