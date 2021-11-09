import { gql } from '@apollo/client';

export default gql`
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
