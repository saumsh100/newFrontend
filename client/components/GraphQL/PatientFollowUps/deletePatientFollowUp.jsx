
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation deletePatientFollowUp_NEST($id: ID!) {
    deletePatientFollowUp(patientFollowUpDeleteInput: { id: $id }) {
      id
    }
  }
`;
