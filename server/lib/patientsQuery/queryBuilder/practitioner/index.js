
import { Appointment } from 'CareCruModels';

/**
 * builds a query object for sequelize query for practitioner of the appointment.
 * @param practitionerId
 * @returns {{
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
 *    }[]
 *  }}
 */
export default function queryPractitioner(practitionerId) {
  return {
    include: [
      {
        model: Appointment,
        as: 'appointments',
        where: Appointment.getCommonSearchAppointmentSchema({ practitionerId }),
        attributes: [],
        duplicating: false,
        required: true,
      },
    ],
  };
}
