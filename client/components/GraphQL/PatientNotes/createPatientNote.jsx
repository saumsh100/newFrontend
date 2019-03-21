
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

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
