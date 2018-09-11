
import { graphql, commitMutation } from 'react-relay';

const mutation = graphql`
  mutation addFamilyWithMembers_Mutation($input: createFamilyWithMembersInput!) {
    createFamilyWithMembersMutation(input: $input) {
      family {
        id
        ccId
        accountId
        members(
          first: 2147483647 # MaxGraphQL Int
        ) @connection(key: "PatientFamily_members", filters: ["first"]) {
          edges {
            node {
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
              omitReminderIds
              omitRecallIds
            }
          }
        }
      }
    }
  }
`;

// clientMutationId must be the global id of the patient to be updated
const commit = (environment, members, clientMutationId) => {
  const input = {
    members,
    clientMutationId,
  };

  return commitMutation(environment, {
    mutation,
    variables: { input },
    updater: (proxyStore) => {
      // get the root field of the mutation return and find the family record on the payload
      const payloadProxy = proxyStore.getRootField('createFamilyWithMembersMutation');
      const newFamilyNode = payloadProxy.getLinkedRecord('family');

      // find the patient node on the current store/cache
      const patientProxy = proxyStore.get(clientMutationId);
      // update the patient family with the mutation data
      patientProxy.setLinkedRecord(newFamilyNode, 'family');
    },
  });
};

export default { commit };
