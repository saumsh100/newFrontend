
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

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
