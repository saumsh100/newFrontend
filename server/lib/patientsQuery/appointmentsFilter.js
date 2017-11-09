
import moment from 'moment';
import { Patient, Appointment, DeliveredProcedure, sequelize } from '../../_models';
import { getIds } from './helpers';

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


export async function FirstLastAppointmentFilter({ data, key }, filterIds, query, accountId) {
  try {
    let prevFilterIds = {};

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const whereObj = {
      accountId,
      ...prevFilterIds,
    };

    whereObj[key] = {
      $between: [data[0], data[1]],
    };

    const searchFirstLastObj = {
      raw: true,
      where: {
        ...whereObj,
      },
      ...query,
    };

    const patientsData = await Patient.findAndCountAll(searchFirstLastObj);

    return patientsData;
  } catch (err) {
    console.log(err);
  }
}

export async function AppointmentsCountFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { patientId: { $not: null } }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        patientId: filterIds,
      };
    }

    const appData = await Appointment.findAll({
      raw: true,
      where: {
        accountId,
        isCancelled: false,
        isDeleted: false,
        isPending: false,
        ...prevFilterIds,
      },
      include: {
        model: Patient,
        as: 'patient',
        attributes: [],
        duplicating: false,
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
        [sequelize.fn('COUNT', 'patient.id'), 'PatientCount'],
      ],
      having: sequelize.literal(`count("patient"."id") ${data[0]} ${data[1]}`),
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


export async function ProductionFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null }  }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }
    console.log('zzzz', prevFilterIds)
    const patientData = await Patient.findAll({
      where: {
        accountId,
        ...prevFilterIds,
      },
      attributes: [
        'Patient.id',
        'Patient.firstName',
        'Patient.lastName',
        'Patient.nextApptDate',
        'Patient.lastApptDate',
        'Patient.birthDate',
        'Patient.status',
        [sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount'],
      ],
      include: [
        {
          model: DeliveredProcedure,
          as: 'deliveredProcedures',
          where: {
            entryDate: {
              gt: moment('1970-01-01').toISOString(),
              lt: new Date(),
            },
          },
          attributes: [],
          duplicating: false,
          required: true,
        },
      ],
      group: ['Patient.id'],
      having: sequelize.literal(`sum("totalAmount") > ${500}`),
      raw: true,
    });

    const truncatedData = ManualLimitOffset(patientData, query);

    return ({
      rows: truncatedData,
      count: patientData.length,
    });
  } catch (err) {
    console.log(err);
  }
}
