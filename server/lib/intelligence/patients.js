import sequelize from 'sequelize';
import { Patient } from '../../_models';


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
