import moment from 'moment';
import {
  Patient,
  Appointment,
  DeliveredProcedure,
  sequelize,
  PatientUser,
  Request,
} from '../../_models';
import { ManualLimitOffset, getIds, patientAttributes } from './helpers';
import Appointments from '../../../client/entities/models/Appointments';

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
          patientId: {
            $not: null,
          },
          startDate: {
            $lt: new Date(),
          },
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
      group: ['Patient.id'],
      attributes: patientAttributes,
      having: sequelize.literal(`count("appointments"."patientId") ${data[0]} ${data[1]}`),
      ...query,
    });

    return {
      rows: patientData.rows,
      count: patientData.count.length,
    };
  } catch (err) {
    console.log(err);
  }
}

export async function ProductionFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } };

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }
    const patientData = await Patient.findAndCountAll({
      where: {
        accountId,
        ...prevFilterIds,
      },
      attributes: patientAttributes.concat([
        [sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount'],
      ]),
      include: [
        {
          model: DeliveredProcedure,
          as: 'deliveredProcedures',
          where: {
            entryDate: {
              gt: moment()
                .subtract(1, 'years')
                .toISOString(),
              lt: new Date(),
            },
          },
          attributes: [],
          duplicating: false,
          required: true,
        },
      ],
      group: ['Patient.id'],
      having: sequelize.literal(`sum("totalAmount") >= ${data[0]} AND sum("totalAmount") <= ${data[1]}`),
      raw: true,
      ...query,
    });

    return {
      rows: patientData.rows,
      count: patientData.count.length,
    };
  } catch (err) {
    console.log(err);
  }
}

export async function OnlineAppointmentsFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } };

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const patientData = await Request.findAll({
      raw: true,
      where: {
        accountId,
        isCancelled: false,
        isConfirmed: true,
      },
      include: {
        model: PatientUser,
        as: 'patientUser',
        required: true,
        duplicating: false,
        attributes: [],
        include: {
          model: Patient,
          as: 'patients',
          where: {
            ...prevFilterIds,
          },
          required: true,
          duplicating: false,
          attributes: [],
        },
      },
      attributes: ['patientUser.id'],
      having: sequelize.literal(`count("patientUser"."id") ${data[0]} ${data[1]}`),
      group: ['patientUser.id'],
    });

    const patientUserIds = getIds(patientData, 'id');

    return await Patient.findAndCountAll({
      raw: true,
      where: {
        accountId,
        patientUserId: patientUserIds,
      },
      ...query,
    });
  } catch (err) {
    console.log(err);
  }
}
