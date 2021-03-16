
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

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
