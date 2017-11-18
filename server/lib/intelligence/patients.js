import sequelize from 'sequelize';
import { Patient, Appointment } from '../../_models';

/**
 * get's the number of newPatients in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @return {[object]} a sql object with field newPatients and result
 */
export function newPatients(startDate, endDate, accountId) {
  return Patient.findAll({
    where: {
      accountId,
      pmsCreatedAt: {
        gt: startDate,
        lt: endDate,
      },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('accountId')), 'newPatients'],
    ],
    group: ['accountId'],
  });
}

/**
 * get's the number of active patients in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @return {[int]} number of active Patients
 */
export async function activePatients(startDate, endDate, accountId) {
  const appointments = await Appointment.findAll({
    include: [
      {
        model: Patient,
        as: 'patient',
        duplicating: false,
        required: true,
        attributes: [],
      },
    ],
    where: {
      accountId,
      isCancelled: {
        $ne: true,
      },
      $or: [
        {
          startDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
            lt: endDate,
          },
        },
      ],
      patientId: {
        $not: null,
      },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('Appointment.patientId')), 'activePatients'],
    ],
    group: ['Appointment.patientId'],
    raw: true,
  });
  return appointments[0] ? appointments.length : 0;
}
