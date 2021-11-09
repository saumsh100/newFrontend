import { gql } from '@apollo/client';

export default gql`
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
        omitReminderIds
        omitRecallIds
      }
    }
  }
`;
