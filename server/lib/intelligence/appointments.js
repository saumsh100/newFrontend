import moment from 'moment';
import { Appointment, Practitioner, Patient, sequelize } from '../../_models';

/**
 * get's the number of hygien apps in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @return {[object]} a sql object with field appsHygienist and result
 */
export function appsHygienist(startDate, endDate, accountId) {
  return Appointment.findAll({
    include: [
      {
        model: Practitioner,
        as: 'practitioner',
        duplicating: false,
        required: true,
        attributes: [],
        where: {
          type: 'Hygienist',
        },
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
      [sequelize.fn('COUNT', sequelize.col('Appointment.accountId')), 'appsHygienist'],
    ],
    group: ['Appointment.accountId'],
    raw: true,
  });
}

/**
 * get's the the top 4 patients in apps in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @return {[array]} array of sql objects with field numAppointments and patient
 */
export function mostAppointments(startDate, endDate, accountId) {
  return Appointment.findAll({
    include: [
      {
        model: Patient,
        as: 'patient',
        duplicating: false,
        required: true,
        attributes: [
          ['id', 'id'],
          ['firstName', 'firstName'],
          ['lastName', 'lastName'],
          ['birthDate', 'birthDate'],
          [sequelize.fn('COUNT', sequelize.col('patient.id')), 'numAppointments'],
        ],
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
    },
    attributes: [
      // [sequelize.fn('COUNT', sequelize.col('patient.id')), 'numAppointments'],
    ],
    order: [[sequelize.fn('COUNT', sequelize.col('patient.id')), 'DESC']],
    limit: 4,
    group: ['patient.id'],
    raw: true,
    nest: true,
  });
}

/**
 * get's the number of hygien apps in an account for a given startDate and endDate and practitioner
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @param  {[uuid]} practitionerId
 * @return {[object]} a sql object with field appsHygienist and result
 */
export function appsNewPatient(startDate, endDate, accountId, practitionerId) {
  return Appointment.findAll({
    include: [
      {
        model: Practitioner,
        as: 'practitioner',
        duplicating: false,
        required: true,
        attributes: [],
        where: {
          id: practitionerId,
        },
      },
      {
        model: Patient,
        as: 'patient',
        duplicating: false,
        required: true,
        where: {
          pmsCreatedAt: {
            gt: startDate,
            lt: endDate,
          },
        },
        attributes: ['id'],
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
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('patient.id')), 'appsNewPatient'],
    ],
    group: ['patient.id'],
    raw: true,
  });
}

/**
 * get's the number of totalAppointments in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @param  {[uuid]} where - any custom fitler you want to send im
 * @return {[int]} total appointments in a given period
 */
export async function totalAppointments(startDate, endDate, accountId, where = {}) {
  const number = await Appointment.findAll({
    where: {
      accountId,
      isCancelled: {
        $ne: true,
      },
      isPending: {
        $ne: true,
      },
      patientId: {
        $ne: null,
      },
      ...where,
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
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('accountId')), 'totalAppointments'],
    ],
    group: ['accountId'],
    raw: true,
  });

  return number[0] ? number[0].totalAppointments : 0;
}

/**
 * get's the number of appsNotCancelled in an account for a given startDate and endDate
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @param  {[uuid]} accountId
 * @return {[int]} appointments not cancelled in a given period
 */
export async function appsNotCancelled(startDate, endDate, accountId) {
  const practs = await Practitioner.findAll({
    where: {
      accountId,
      isActive: true,
    },
    raw: true,
  });

  let total = 0;
  for (let i = 0; i < practs.length; i += 1) {
    let result = await appsCancelledReplaced(startDate, endDate, practs[i].id);

    result = result[0][0] ? result[0][0].notCancelled : '0';
    total += Number(result);
  }
  return total;
}

/**
 * [totalAppointmentHoursPractitioner get's the hours a practitioner
 * worked in appointments in an account for a given startDate and endDate]
 * @param  {[type]} startDate
 * @param  {[type]} endDate
 * @param  {[type]} practitionerId
 * @return {[float]}                [float of hours works]
 */
export async function totalAppointmentHoursPractitioner(startDate, endDate, practitionerId) {
  let total = await Appointment.findAll({
    where: {
      practitionerId,
      isCancelled: {
        $ne: true,
      },
      isPending: {
        $ne: true,
      },
      patientId: {
        $ne: null,
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
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.literal('EXTRACT(EPOCH FROM ("Appointment"."endDate" - "Appointment"."startDate"))')), 'totalAppointmentSeconds'],
    ],
    group: ['practitionerId'],
    raw: true,
  });

  total = total[0] ? total[0].totalAppointmentSeconds : 0;

  return total / (60 * 60);
}

export async function appsCancelledReplaced(startDate, endDate, practitionerId) {


  /*
  * Query finds the number of appointments that were made after a cancellation for the same time slot
  * for a given practitioner
  * Query finds non cancelled appointments for all cancelled appointments with the same start or end date
  * from a startDate and endDate
  */
  return sequelize.query(`SELECT COUNT("accountId") as "notCancelled" FROM "Appointments"
  WHERE "isCancelled" = false
  AND "practitionerId" = :practitionerId
  AND ("startDate" IN (SELECT "startDate" FROM "Appointments" WHERE "isCancelled" = true
                     and "practitionerId" = :practitionerId
                     AND "startDate" BETWEEN :startDate AND :endDate)
    OR "endDate" IN (SELECT "endDate" FROM "Appointments" WHERE "isCancelled" = true
                     and "practitionerId" = :practitionerId
                    AND "startDate" BETWEEN :startDate AND :endDate))
  GROUP BY "accountId"`,
    {
      replacements: {
        practitionerId,
        startDate: moment(startDate).toISOString(),
        endDate: moment(endDate).toISOString(),
      },
    });
}
