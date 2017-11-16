
import { Patient, Appointment, } from '../../_models';
import { ManualLimitOffset } from './helpers';

export async function PractitionersFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } }

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
          isCancelled: false,
          isDeleted: false,
          isPending: false,
          practitionerId: data[0],
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
      group: ['Patient.id'],
      attributes: [
        'Patient.id',
        'Patient.firstName',
        'Patient.lastName',
        'Patient.nextApptDate',
        'Patient.lastApptDate',
        'Patient.birthDate',
        'Patient.status',
      ],
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
