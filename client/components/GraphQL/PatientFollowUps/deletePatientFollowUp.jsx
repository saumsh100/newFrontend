import { gql } from '@apollo/client';

export default gql`
  mutation deletePatientFollowUp_NEST($id: ID!) {
    deletePatientFollowUp(patientFollowUpDeleteInput: { id: $id }) {
      id
    }
  }
`;
