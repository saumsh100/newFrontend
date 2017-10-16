import { Appointment } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchAppointmentEvents(patientId) {
  return Appointment.findAll({
    raw: true,
    where: {
      patientId,
      isDeleted: false,
      isCancelled: false,
    },

    order: [['createdAt', 'ASC']],
  });
}
