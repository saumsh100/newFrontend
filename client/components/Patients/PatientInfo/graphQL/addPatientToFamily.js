
import { graphql, commitMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation addPatientToFamily_Mutation($input: updatePatientInput!) {
    updatePatientMutation(input: $input) {
      clientMutationId
      patient {
        id
        ccId
        accountId
        avatarUrl
        firstName
        lastName
        birthDate
        lastApptDate
        nextApptDate
        dueForHygieneDate
        dueForRecallExamDate
        status
      }
    }
  }
`;

// clientMutationId must be the global id of the patient to be updated
const commit = (environment, patient, familyId, clientMutationId) => {
  const input = {
    id: patient.id,
    accountId: patient.accountId,
    firstName: patient.firstName,
    lastName: patient.lastName,
    familyId,
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
      const newPatientNode = payloadProxy.getLinkedRecord('patient');

      // find the patient node on the current store/cache
      const patientProxy = proxyStore.get(clientMutationId);
      // find its family record
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
          first: 2147483647, // max graphql int
        },
      );
      /**
       * again because of relay style connection we need to first create
       * the new edge of the relationship.
       * */
      const edge = ConnectionHandler.createEdge(
        proxyStore,
        familyMembersConnection,
        newPatientNode,
        'MembersEdge', // as convetion the egde name is always Type + Edge
      );
      // then add the edge to the end of the connection
      ConnectionHandler.insertEdgeAfter(familyMembersConnection, edge);
    },
  });
};

export default { commit };
