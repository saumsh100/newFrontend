
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation updatePatientFollowUp_NEST(
    $id: ID!
    $userId: String!
    $note: String
    $dueAt: String!
    $completedAt: String
    $patientFollowUpTypeId: String!
  ) {
    updatePatientFollowUp(
      patientFollowUpUpdateInput: {
        id: $id
        userId: $userId
        note: $note
        dueAt: $dueAt
        completedAt: $completedAt
        patientFollowUpTypeId: $patientFollowUpTypeId
      }
    ) {
      id
      patientId
      accountId
      userId
      note
      date
      dueAt
      completedAt
      patientFollowUpType: patientFollowUpType {
        id
        name
      }
    }
  }
`;
