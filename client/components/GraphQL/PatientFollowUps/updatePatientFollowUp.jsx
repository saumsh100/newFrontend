import { gql } from '@apollo/client';

export default gql`
  mutation updatePatientFollowUp_NEST(
    $id: ID!
    $userId: String!
    $assignedUserId: String
    $note: String
    $dueAt: String!
    $completedAt: String
    $patientFollowUpTypeId: String!
  ) {
    updatePatientFollowUp(
      patientFollowUpUpdateInput: {
        id: $id
        userId: $userId
        assignedUserId: $assignedUserId
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
      assignedUserId
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
