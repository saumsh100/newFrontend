import { gql } from '@apollo/client';

export default gql`
  mutation createPatientNote_NEST(
    $accountId: String!
    $patientId: String!
    $userId: String!
    $note: String!
  ) {
    createPatientNote(
      patientNoteCreateInput: {
        accountId: $accountId
        patientId: $patientId
        userId: $userId
        note: $note
      }
    ) {
      id
      note
      date
      patientId
      accountId
    }
  }
`;
