
import { graphql, commitMutation } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const mutation = graphql`
  mutation deleteWaitSpot_Mutation($input: deleteWaitSpotInput!) {
    deleteWaitSpotMutation(input: $input) {
      clientMutationId
    }
  }
`;

/**
 * Relay mutation wrapped on a promise so when can use it on redux thunks
 * @param  input.id
 */
const commit = input =>
  commitMutation(graphQLEnvironment, {
    mutation,
    variables: {
      input,
    },
    updater: (proxyStore) => {
      // // get the root field of the mutation return and find the patient record on the payload
      const payloadProxy = proxyStore.getRootField('deleteWaitSpotMutation');
      console.log(payloadProxy);

      const idToDelete = payloadProxy.getLinkedRecord('waitSpot');
      console.log(idToDelete);
      // // find its family record
      // const patientProxy = proxyStore.get(clientMutationId);
      // const familyProxy = patientProxy.getLinkedRecord('family');
      // // here we need to get the relay style connection for the members
      // const familyMembersConnection = ConnectionHandler.getConnection(
      //   familyProxy,
      //   'PatientFamily_members',
      //   {
      //     /**
      //      * this needs to match with the query used to retrieve the data
      //      * we need this because the relay compiler enforces every connection
      //      * to have a directive, either first or last
      //      * */
      //     first: 2147483647,
      //   }
      // );
      // // get the edges from the connection
      // const edges = familyMembersConnection.getLinkedRecords('edges');
      //
      // // delete the node or deletes the family if it is removing the last member
      // if (edges.length === 1) {
      //   proxyStore.delete(familyProxy.getDataID());
      // } else {
      //   ConnectionHandler.deleteNode(familyMembersConnection, idToDelete);
      // }
    },
  });

export default { commit };
