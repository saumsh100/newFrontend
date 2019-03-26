
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation createManualSentRecalls_NEST(
    $accountId: String!
    $patientId: String!
    $primaryType: String!
  ) {
    createManualSentRecalls(
      sentRecallsCreateInput: {
        accountId: $accountId
        patientId: $patientId
        primaryType: $primaryType
        recallId: "ad4fb0a3-2bee-4a9e-94d2-f62d1a95c4af"
        appointmentId: "3178442a-12db-4a08-bcd6-9062a7ad6541"
      }
    ) {
      sentRecall {
        id
        primaryType
        patientId
        isAutomated
      }
    }
  }
`;
