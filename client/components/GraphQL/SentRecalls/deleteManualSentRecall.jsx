import { gql } from '@apollo/client';

export default gql`
  mutation deleteManualSentRecall_NEST($id: ID!) {
    deleteManualSentRecall(sentRecallDeleteInput: { id: $id }) {
      id
    }
  }
`;
