import sequelize from 'sequelize';
import { DeliveredProcedure, Patient, Procedure } from '../../_models';


export function mostBusinessPatient(startDate, endDate, accountId) {
  return Patient.findAll({
    where: {
      accountId,
    },
    attributes: [
      'Patient.firstName',
      'Patient.lastName',
      [sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount'],
    ],
    include: [
      {
        model: DeliveredProcedure,
        as: 'deliveredProcedures',
        where: {
          entryDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        attributes: [],
        duplicating: false,
        required: true,
      },
    ],
    group: ['Patient.id'],
    order: [[sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'DESC']],
    raw: true,
    limit: 5,
  });
}

export function mostBusinessProcedure(startDate, endDate, accountId) {
  return Procedure.findAll({
    attributes: [
      'Procedure.description',
      'Procedure.type',
      'deliveredProcedures.procedureCode',
      [sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount'],
    ],
    include: [
      {
        model: DeliveredProcedure,
        as: 'deliveredProcedures',
        where: {
          accountId,
          entryDate: {
            gt: startDate,
            lt: endDate,
          },
        },
        attributes: [],
        duplicating: false,
        required: true,
      },
    ],
    group: ['Procedure.code', 'deliveredProcedures.procedureCode'],
    order: [[sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'DESC']],
    raw: true,
    limit: 5,
  });
}
