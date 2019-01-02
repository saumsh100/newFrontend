
import { Appointment } from '../../../_models';

export async function fetchAppointmentEvents({ patientId, accountId, query }) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId,
      patientId,
      isDeleted: false,
      isMissed: false,
      isPending: false,
    },
    attributes: ['id', 'startDate', 'endDate', 'note', 'isCancelled', 'isPatientConfirmed'],
    order: [['startDate', 'DESC']],
    ...query,
  });
}

export function buildAppointmentEvent({ data }) {
  return {
    id: Buffer.from(`appointment-${data.id}`).toString('base64'),
    type: 'appointment',
    metaData: {
      ...data,
      createdAt: data.startDate,
    },
  };
}
