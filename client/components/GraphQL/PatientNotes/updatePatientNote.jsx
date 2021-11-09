import { gql } from '@apollo/client';

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
