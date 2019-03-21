
export default () => `
  query($patientId: String!) {
    patientNotes(patientNotesReadInput: { patientId: $patientId }) {
		  id,
		  patientId,
		  accountId,
      note,
      date,
    }
  }
`;
