
import { graphql, requestSubscription } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../../util/graphqlEnvironment';

const subscription = graphql`
  subscription subscriptionRemoveWaitSpot_Subscription($accountId: String!) {
    removeWaitSpot(accountId: $accountId) {
      id
    }
  }
`;

const register = accountId =>
  requestSubscription(environment, {
    subscription,
    variables: {
      accountId,
    },
    onError: error => console.error(error),
    updater: (proxyStore) => {
      const root = proxyStore.getRootField('removeWaitSpot');
      const idToDelete = root.getValue('id');
      const proxyRoot = proxyStore.getRoot();
      const accountViewerProxy = proxyRoot.getLinkedRecord('accountViewer');

      const waitSpotsConnection = ConnectionHandler.getConnection(
        accountViewerProxy,
        'AccountViewer_waitSpots'
      );

      if (!waitSpotsConnection) {
        return;
      }

      ConnectionHandler.deleteNode(waitSpotsConnection, idToDelete);
    },
  });

export default {
  register,
};
