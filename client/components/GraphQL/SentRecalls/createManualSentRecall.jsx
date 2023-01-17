import { gql } from '@apollo/client';

export default gql`
  mutation createManualSentRecall_NEST(
    $accountId: String!
    $patientId: String!
    $primaryType: String!
    $userId: String!
    $createdAt: String
    $note: String
    $sentRecallOutcomeId: String
    $source: String
  ) {
    createManualSentRecall(
      sentRecallCreateInput: {
        accountId: $accountId
        patientId: $patientId
        primaryType: $primaryType
        userId: $userId
        createdAt: $createdAt
        note: $note
        sentRecallOutcomeId: $sentRecallOutcomeId
        source: $source
      }
    ) {
      id
      accountId
      patientId
      primaryType
      source
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
