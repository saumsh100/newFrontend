// import sequelize from 'sequelize';
import moment from 'moment';
import { Appointment, Practitioner, sequelize } from '../../_models';


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
