import sequelize from 'sequelize';
import { DeliveredProcedure, Patient, Procedure } from '../../_models';
import { patientAttributes } from "../patientsQuery/helpers";

// SQL query that gets Patients and joins with delivered procedures and
// groups by deliveredProcedures.procedurecode and totals up the cost from them.
// IE the total cost the patient spent between startDate and endDate

export function mostBusinessPatient(startDate, endDate, accountId, searchClause = {}) {
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
          isCompleted: true,
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

export function mostBusinessSinglePatient(startDate, endDate, accountId, patientIds, order = []) {
  return Patient.findAll({
    where: {
      accountId,
      id: patientIds,
    },

    attributes: patientAttributes.concat([[sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount']]),
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
        required: false,
      },
    ],
    required: true,
    group: ['Patient.id'],
    raw: true,
    order,
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
          isCompleted: true,
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
  }).catch();
}


export function mostBusinessClinic(startDate, endDate, accountId) {
  return DeliveredProcedure.findAll({
    where: {
      accountId,
      entryDate: {
        gt: startDate,
        lt: endDate,
      },
      isCompleted: true,
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('totalAmount')), 'totalAmountClinic'],
    ],
    group: ['accountId'],
  });
}
