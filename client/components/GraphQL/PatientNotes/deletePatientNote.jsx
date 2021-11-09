import { gql } from '@apollo/client';

export default gql`
  mutation deletePatientNote_NEST($id: ID!) {
    deletePatientNote(patientNoteDeleteInput: { id: $id }) {
      id
    }
  }
`;
