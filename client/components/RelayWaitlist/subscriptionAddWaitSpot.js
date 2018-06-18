
import { graphql, requestSubscription } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '../../util/graphqlEnvironment';
import DesktopNotification from '../../util/desktopNotification';

const subscription = graphql`
  subscription subscriptionAddWaitSpot_Subscription($accountId: String!) {
    newWaitSpot(accountId: $accountId) {
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

const register = accountId =>
  requestSubscription(environment, {
    subscription,
    variables: {
      accountId,
    },
    onError: error => console.error(error),
    updater: (proxyStore, data) => {
      const nodeToInsert = proxyStore.getRootField('newWaitSpot');
      const root = proxyStore.getRoot();
      const accountViewerProxy = root.getLinkedRecord('accountViewer');

      const waitSpotsConnection = ConnectionHandler.getConnection(
        accountViewerProxy,
        'AccountViewer_waitSpots'
      );

      const { newWaitSpot } = data;
      const patient = newWaitSpot.patient ? newWaitSpot.patient : newWaitSpot.patientUser;

      const fullName = `${patient.firstName} ${patient.lastName}`;

      const messageHeading = 'New wait spot request';
      DesktopNotification.showNotification(messageHeading, {
        body: `New wait spot request by ${fullName}.`,
      });

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

export default {
  register,
};
