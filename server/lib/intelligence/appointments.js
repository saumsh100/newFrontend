import sequelize from 'sequelize';
import { Appointment, Practitioner } from '../../_models';


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
