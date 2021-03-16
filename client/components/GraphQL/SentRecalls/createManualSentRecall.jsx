
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation createManualSentRecall_NEST(
    $accountId: String!
    $patientId: String!
    $primaryType: String!
    $userId: String!
    $createdAt: String
    $note: String
    $sentRecallOutcomeId: String
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
