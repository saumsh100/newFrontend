import { Appointment, AppointmentCode } from '../../../_models';

/**
 * [fetchApptsWithCodes fetches appointments with appointmentCodes]
 * @param  {[object]} where [where clause]
 * @return {[array]}       [array of appointments]
 */
export function fetchApptsWithCodes(where) {
  return Appointment.findAll({
    where,
    include: [{
      model: AppointmentCode,
      as: 'appointmentCodes',
    }],
  });
}
