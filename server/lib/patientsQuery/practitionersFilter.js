
import { Patient, Appointment } from '../../_models';
import { patientAttributes } from './helpers';
import Appointments from '../../../client/entities/models/Appointments';

export async function PractitionersFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } };

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const patientData = await Patient.findAndCountAll({
      raw: true,
      where: {
        accountId,
        ...prevFilterIds,
      },
      include: {
        model: Appointment,
        as: 'appointments',
        where: {
          accountId,
          ...Appointments.getCommonSearchAppointmentSchema(),
          practitionerId: data[0],
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
      group: ['Patient.id'],
      attributes: patientAttributes,
      ...query,
    });

    return ({
      rows: patientData.rows,
      count: patientData.count.length,
    });
  } catch (err) {
    console.log(err);
  }
}
