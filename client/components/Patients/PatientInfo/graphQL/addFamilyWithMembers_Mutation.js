
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

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
