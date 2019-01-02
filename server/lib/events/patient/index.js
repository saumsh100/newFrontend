
import moment from 'moment-timezone';

export function buildNewPatientEvent({ patient, accountId }) {
  return {
    id: Buffer.from(`patient-${patient.id}`).toString('base64'),
    patientId: patient.id,
    accountId,
    type: 'newPatient',
    metaData: {
      createdAt: patient.pmsCreatedAt || patient.createdAt,
      pmsCreatedAt: patient.pmsCreatedAt,
      firstName: patient.firstName,
      lastName: patient.lastName,
    },
  };
}

export function fetchPatientDueDateEvents({ patient }) {
  const { dueForRecallExamDate, dueForHygieneDate } = patient;
  if (!dueForHygieneDate && !dueForRecallExamDate) return [];

  if (moment(dueForRecallExamDate).isSame(dueForHygieneDate, 'day')) {
    return [
      {
        dueDate: dueForHygieneDate,
        dateType: 'same',
      },
    ];
  }

  if (
    (dueForHygieneDate && !dueForRecallExamDate) ||
    (dueForHygieneDate && dueForHygieneDate < dueForRecallExamDate)
  ) {
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
    firstName: patient.firstName,
    lastName: patient.lastName,
    createdAt: data.dueDate,
    ...data,
  };

  return {
    id: Buffer.from(`patientDueDate-${patient.id}`).toString('base64'),
    type: 'dueDate',
    metaData,
  };
}
