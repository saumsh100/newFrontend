
export default () => `
  query($patientId: String!) {
    patientFollowUps(patientFollowUpsReadInput: { patientId: $patientId }) {
		  id,
		  patientId,
		  accountId,
		  userId,
      note,
      date,
      dueAt,
      completedAt,
      patientFollowUpType: patientFollowUpType {
        id,
        name,
      },
    }
  }
`;
