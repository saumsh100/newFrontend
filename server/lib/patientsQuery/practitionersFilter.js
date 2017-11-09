
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

    const appData = await Appointment.findAll({
      raw: true,
      where: {
        accountId,
        isCancelled: false,
        isDeleted: false,
        isPending: false,
        practitionerId: data[0],
      },
      include: {
        model: Patient,
        as: 'patient',
        where: {
          ...prevFilterIds,
        },
        attributes: [],
        duplicating: false,
        required: true,
      },
      group: ['patient.id'],
      attributes: [
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.nextApptDate',
        'patient.lastApptDate',
        'patient.birthDate',
        'patient.status',
      ],
    });

    const truncatedData = ManualLimitOffset(appData, query);

    return ({
      rows: truncatedData,
      count: appData.length,
    });

  } catch (err) {
    console.log(err);
  }
}
