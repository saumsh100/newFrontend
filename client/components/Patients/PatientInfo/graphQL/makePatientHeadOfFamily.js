
import { graphql, commitMutation } from 'react-relay';

const mutation = graphql`
  mutation makePatientHeadOfFamily_Mutation($input: updateFamilyInput!) {
    updateFamilyMutation(input: $input) {
      clientMutationId
      family {
        id
        ccId
        head {
          id
          ccId
          pmsId
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
  }
`;

const commit = (environment, patient, family) => {
  const input = {
    id: family.ccId,
    headId: patient.ccId,
    accountId: patient.accountId,
    clientMutationId: family.id,
  };

  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    updater: (proxyStore) => {
      // get the root field of the mutation return and find the head record on the payload
      const payloadProxy = proxyStore.getRootField('updateFamilyMutation');
      const newFamilyNode = payloadProxy.getLinkedRecord('family');
      const newHeadNode = newFamilyNode.getLinkedRecord('head');

      // find the family node on the current store/cache
      const familyProxy = proxyStore.get(family.id);
      // add the new head to it
      familyProxy.setLinkedRecord(newHeadNode, 'head');
    },
  });
};

export default { commit };
