
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation deletePatientNote_NEST($id: ID!) {
    deletePatientNote(patientNoteDeleteInput: { id: $id }) {
      id
    }
  }
`;
