import { Appointment, Event } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

export function fetchAppointmentEvents(patientId, accountId) {
  return Appointment.findAll({
    raw: true,
    where: {
      patientId,
      isDeleted: false,
      isCancelled: false,
    },

    order: [['createdAt', 'ASC']],
  }).then((appointments) => {
    return appointments.map((app) => {
      const buildData = {
        id: app.id,
        patientId,
        accountId,
        type: 'Appointment',
        metaData: {
          createdAt: app.createdAt,
          startDate: app.startDate,
          endDate: app.endDate,
          note: app.note,
        },
      };

      return Event.build(buildData).get({ plain: true });
    });
  });
}
