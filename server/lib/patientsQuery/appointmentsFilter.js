
import moment from 'moment';
import { Patient, Appointment } from '../../_models';
import { getIds } from './helpers';

export async function FirstAppointmentFilter({ firstAppointment }, filterIds, query, accountId) {
  try {
    let prevFilterIds = {};
    let patientIds = { $not: null }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };

      patientIds = filterIds;
    }

    const searchFirstLastObj = {
      raw: true,
      where: {
        accountId,
        ...prevFilterIds,
      },
      include: [{
        model: Appointment,
        as: 'firstAppt',
        where: {
          startDate: {
            $between: [firstAppointment[0], firstAppointment[1]],
          },
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],

      }].concat(query.include),
      limit: query.limit,
      offset: query.offset,
    };

    const patientsData = await Patient.findAndCountAll(searchFirstLastObj);

    patientIds = patientsData ? getIds(patientsData.rows, 'id') : patientIds;

    return patientsData;
  } catch (err) {
    console.log(err);
  }
}
