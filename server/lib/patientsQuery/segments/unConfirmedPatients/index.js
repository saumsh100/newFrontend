
import moment from 'moment';
import { Appointment } from 'CareCruModels';

/**
 * builds a query object for sequelize query for unconfirmed patients segment.
 * @param days
 * @returns {{raw: boolean, where: {nextApptId: {$not: null}}, include: *[]}}
 */
export default function unConfirmedPatients(days = 7) {
  return {
    where: { nextApptId: { $not: null } },
    include: [
      {
        model: Appointment,
        as: 'nextAppt',
        where: {
          startDate: {
            $between: [
              new Date(),
              moment()
                .add(days, 'days')
                .toISOString(),
            ],
          },
          ...Appointment.getCommonSearchAppointmentSchema({ isPatientConfirmed: false }),
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
        required: true,
      },
      {
        model: Appointment,
        as: 'lastAppt',
        attributes: ['startDate'],
        groupBy: ['startDate'],
        required: false,
      },
    ],
  };
}
