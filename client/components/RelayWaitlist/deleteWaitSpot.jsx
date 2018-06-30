
import { graphql, commitMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const mutation = graphql`
  mutation deleteWaitSpot_Mutation($input: deleteWaitSpotInput!) {
    deleteWaitSpotMutation(input: $input) {
      clientMutationId
      waitSpot {
        id
      }
    }
  }
`;

const commit = ({ id, accountViewerClientId }) =>
  commitMutation(graphQLEnvironment, {
    mutation,
    variables: {
      input: { id },
    },
    updater: (proxyStore) => {
      const root = proxyStore.getRootField('deleteWaitSpotMutation');
      const idToDelete = root.getLinkedRecord('waitSpot').getValue('id');
      const accountProxy = proxyStore.get(accountViewerClientId);

      const waitSpotsConnection = ConnectionHandler.getConnection(
        accountProxy,
        'AccountViewer_waitSpots',
      );
      ConnectionHandler.deleteNode(waitSpotsConnection, idToDelete);
    },
  });

export default { commit };
