
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation updateManualSentRecall_NEST(
    $id: String!
    $primaryType: String
    $createdAt: String
    $note: String
  ) {
    updateSentRecall(
      sentRecallUpdateInput: {
        id: $id
        primaryType: $primaryType
        createdAt: $createdAt
        note: $note
      }
    ) {
      id
      accountId
      patientId
      primaryType
      note
      userId
      createdAt
      isAutomated
    }
  }
`;
