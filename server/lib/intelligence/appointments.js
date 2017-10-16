import moment from 'moment';
import { Appointment, Practitioner, Patient, sequelize } from '../../_models';


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
