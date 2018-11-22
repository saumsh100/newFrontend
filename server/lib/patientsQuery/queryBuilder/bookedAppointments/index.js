
import { Appointment, sequelize } from 'CareCruModels';

/**
 * builds a query object for sequelize query for the booked appointments quantity per Patient.
 * @param comparator
 * @param value
 * @returns {{
 *    attributes: *[][],
 *    include: {
 *      model: *,
 *      as: string,
 *      where: {
 *        isCancelled,
 *        isDeleted,
 *        isMissed,
 *        isPending
 *      },
 *      attributes: Array,
 *      duplicating: boolean,
 *      required: boolean
 *    }[],
 *    group: string[],
 *    having: *[]
 *  }}
 */
export default function queryBookedAppointments([comparator, value]) {
  return {
    attributes: [
      [
        sequelize.fn('count', sequelize.col('appointments.patientId')),
        'bookedAppointmentsCount',
      ],
    ],
    include: [
      {
        model: Appointment,
        as: 'appointments',
        where: Appointment.getCommonSearchAppointmentSchema({ startDate: { lt: new Date() } }),
        attributes: [],
        duplicating: false,
        required: true,
      },
    ],
    group: ['Patient.id'],
    having: [
      {},
      sequelize.where(
        sequelize.fn('count', sequelize.col('appointments.patientId')),
        comparator,
        value,
      ),
    ],
  };
}
