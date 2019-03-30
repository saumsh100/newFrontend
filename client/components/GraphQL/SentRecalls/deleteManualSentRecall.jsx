
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation deleteManualSentRecall_NEST($id: ID!) {
    deleteManualSentRecall(sentRecallDeleteInput: { id: $id }) {
      id
    }
  }
`;
