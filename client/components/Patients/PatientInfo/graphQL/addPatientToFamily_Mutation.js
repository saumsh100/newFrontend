
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

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
