
import { Patient, Appointment, Practitioner } from '../../_models';


function ManualLimitOffset(eventsArray, query) {
  const {
    limit,
    offset,
  } = query;

  let filterArray = eventsArray;

  if (offset && eventsArray.length > offset) {
    filterArray = filterArray.slice(offset, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}

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
