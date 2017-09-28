import sequelize from 'sequelize';
import { DeliveredProcedure, Patient, Procedure } from '../../_models';

// SQL query that gets Patients and joins with delivered procedures and
// groups by deliveredProcedures.procedurecode and totals up the cost from them.
// IE the total cost the patient spent between startDate and endDate

export function mostBusinessPatient(startDate, endDate, accountId) {
  return Patient.findAll({
    where: {
      accountId,
    },
    attributes: [
      'Patient.firstName',
      'Patient.lastName',
      'Patient.birthDate',
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

// SQL query that gets Procedures and joins with delivered procedures and
// groups by deliveredProcedures.procedurecode and totals up the cost from them.

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


export function mostBusinessClinic(startDate, endDate, accountId) {
  return DeliveredProcedure.findAll({
    where: {
      accountId,
      entryDate: {
        gt: startDate,
        lt: endDate,
      },
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('totalAmount')), 'totalAmountClinic'],
    ],
    group: ['accountId'],
  });
}
