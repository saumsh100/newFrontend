import { gql } from '@apollo/client';

export default gql`
  mutation updateManualSentRecall_NEST(
    $id: String!
    $primaryType: String
    $createdAt: String
    $note: String
    $sentRecallOutcomeId: String
  ) {
    updateSentRecall(
      sentRecallUpdateInput: {
        id: $id
        primaryType: $primaryType
        createdAt: $createdAt
        note: $note
        sentRecallOutcomeId: $sentRecallOutcomeId
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
      sentRecallOutcome: sentRecallOutcome {
        id
        name
      }
    }
  }
`;
