import { gql } from '@apollo/client';

export default gql`
  mutation createPatientFollowUp_NEST(
    $accountId: String!
    $patientId: String!
    $userId: String!
    $assignedUserId: String!
    $dueAt: String!
    $patientFollowUpTypeId: String!
    $note: String
  ) {
    createPatientFollowUp(
      patientFollowUpCreateInput: {
        accountId: $accountId
        patientId: $patientId
        assignedUserId: $assignedUserId
        userId: $userId
        note: $note
        dueAt: $dueAt
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
