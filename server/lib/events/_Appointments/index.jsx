
import { Appointment, Event } from '../../../_models';

export function fetchAppointmentEvents(patientId, accountId, query) {
  return Appointment.findAll({
    raw: true,
    where: {
      patientId,
      isDeleted: false,
      isCancelled: false,
      isPending: false,
    },
    ...query,
    order: [['startDate', 'DESC']],
  }).then((appointments) => {
    return appointments.map((app) => {
      const buildData = {
        id: app.id,
        patientId,
        accountId,
        type: 'Appointment',
        metaData: {
          createdAt: app.startDate,
          startDate: app.startDate,
          endDate: app.endDate,
          note: app.note,
        },
      };
      const ev = Event.build(buildData);
      return ev.get({ plain: true });
    });
  });
}
