
import { graphql, requestSubscription } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../../util/graphqlEnvironment';

const subscription = graphql`
  subscription subscriptionWaitSpot_Subscription {
    newWaitSpot {
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
        mobilePhoneNumber
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

const register = () => {
  requestSubscription(environment, {
    subscription,
    onError: error => console.error(error),
    updater: (proxyStore) => {
      const nodeToInsert = proxyStore.getRootField('newWaitSpot');
      const root = proxyStore.getRoot();
      const accountViewerProxy = root.getLinkedRecord('accountViewer');

      const waitSpotsConnection = ConnectionHandler.getConnection(
        accountViewerProxy,
        'AccountViewer_waitSpots'
      );

      if (!waitSpotsConnection) {
        return;
      }

      const edge = ConnectionHandler.createEdge(
        proxyStore,
        waitSpotsConnection,
        nodeToInsert,
        'WaitSpotEdge'
      );

      ConnectionHandler.insertEdgeAfter(waitSpotsConnection, edge);
    },
  });
};

export default {
  register,
};
