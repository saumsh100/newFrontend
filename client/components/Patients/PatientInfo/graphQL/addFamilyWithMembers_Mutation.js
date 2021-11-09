import { gql } from '@apollo/client';

export default gql`
  mutation addFamilyWithMembers_Mutation($input: createFamilyWithMembersInput!) {
    createFamilyWithMembersMutation(input: $input) {
      family {
        id
        ccId
        accountId
        members {
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
