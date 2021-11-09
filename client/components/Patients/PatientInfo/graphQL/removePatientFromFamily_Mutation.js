import { gql } from '@apollo/client';

export default gql`
  mutation removePatientFromFamily_Mutation($input: updatePatientInput!) {
    updatePatientMutation(input: $input) {
      clientMutationId
      patient {
        id
      }
    }
  }
`;
