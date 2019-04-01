
import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

export default gql`
  mutation createPatientFollowUp_NEST(
    $accountId: String!
    $patientId: String!
    $userId: String!
    $note: String
    $dueAt: String!
    $patientFollowUpTypeId: String!
  ) {
    createPatientFollowUp(
      patientFollowUpCreateInput: {
        accountId: $accountId
        patientId: $patientId
        assignedUserId: $userId
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
