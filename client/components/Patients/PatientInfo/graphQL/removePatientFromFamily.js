
import { graphql, commitMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation removePatientFromFamily_Mutation($input: updatePatientInput!) {
    updatePatientMutation(input: $input) {
      clientMutationId
      patient {
        id
      }
    }
  }
`;

// clientMutationId must be the global id of the patient to be updated
const commit = (environment, patient, clientMutationId) => {
  const input = {
    id: patient.ccId,
    accountId: patient.accountId,
    firstName: patient.firstName,
    lastName: patient.lastName,
    familyId: null,
    clientMutationId,
  };

  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    updater: (proxyStore) => {
      // get the root field of the mutation return and find the patient record on the payload
      const payloadProxy = proxyStore.getRootField('updatePatientMutation');
      const idToDelete = payloadProxy.getLinkedRecord('patient').getValue('id');
      // find its family record
      const patientProxy = proxyStore.get(clientMutationId);
      const familyProxy = patientProxy.getLinkedRecord('family');
      // here we need to get the relay style connection for the members
      const familyMembersConnection = ConnectionHandler.getConnection(
        familyProxy,
        'PatientFamily_members',
        {
          /**
           * this needs to match with the query used to retrieve the data
           * we need this because the relay compiler enforces every connection
           * to have a directive, either first or last
           * */
          first: 2147483647,
        },
      );
      // get the edges from the connection
      const edges = familyMembersConnection.getLinkedRecords('edges');

      // delete the node or deletes the family if it is removing the last member
      if (edges.length === 1) {
        proxyStore.delete(familyProxy.getDataID());
      } else {
        ConnectionHandler.deleteNode(familyMembersConnection, idToDelete);
      }
    },
  });
};

export default { commit };
