
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation updatePatientNote_NEST($id: ID!, $note: String!, $userId: String!) {
    updatePatientNote(patientNoteUpdateInput: { id: $id, userId: $userId, note: $note }) {
      id
      note
      date
      patientId
      accountId
    }
  }
`;
