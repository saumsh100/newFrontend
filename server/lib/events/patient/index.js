export function buildNewPatientEvent({ patient, accountId }) {
  return {
    id: Buffer.from(`patient-${patient.id}`).toString('base64'),
    patientId: patient.id,
    accountId,
    type: 'NewPatient',
    metaData: {
      createdAt: patient.pmsCreatedAt || patient.createdAt,
      firstName: patient.firstName,
      lastName: patient.lastName,
    },
  };
}

export function fetchPatientDueDateEvents({ patient }) {
  const { dueForRecallExamDate, dueForHygieneDate } = patient;

  if (!dueForHygieneDate && !dueForRecallExamDate) return [];

  if (dueForRecallExamDate === dueForHygieneDate) {
    return [
      {
        dueDate: dueForHygieneDate,
        dateType: 'same',
      },
    ];
  }

  if ((dueForHygieneDate && !dueForRecallExamDate) || dueForHygieneDate > dueForRecallExamDate) {
    return [
      {
        dueDate: dueForHygieneDate,
        dateType: 'hygiene',
      },
    ];
  }
  return [
    {
      dueDate: dueForRecallExamDate,
      dateType: 'recall',
    },
  ];
}

export function buildPatientDueDateEvent({ patient, data }) {
  const metaData = {
    id: Buffer.from(`patientDueDate-${patient.id}`).toString('base64'),
    firstName: patient.firstName,
    lastName: patient.lastName,
    ...data,
  };

  return {
    type: 'DueDate',
    metaData,
  };
}