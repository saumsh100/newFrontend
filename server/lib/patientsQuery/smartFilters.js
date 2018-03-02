
import moment from 'moment';
import { Appointment, Patient, sequelize, Account } from '../../_models';
import { removeRecallDuplicates } from '../recalls/helpers';
import { ManualLimitOffset } from './helpers';

export async function LateAppointmentsFilter(accountId, offSetLimit, smFilter) {
  let startDate = moment().subtract(smFilter.startMonth, 'months').toISOString();
  let endDate = moment().subtract(smFilter.endMonth, 'months').toISOString();

  if (smFilter.startMonth < 0) {
    endDate = moment().add(smFilter.startMonth * -1, 'months').toISOString();
    startDate = moment().add(smFilter.endMonth * -1, 'months').toISOString();
  }

  const accountData = await Account.findById(accountId);
  const account = accountData.get({ plain: true });

  const patientsHygieneWithInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: {
        $ne: null,
      },
      lastHygieneDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastHygieneDate" + "insuranceInterval"::Interval )`),
      sequelize.literal(`'${startDate}' < ("lastHygieneDate" + "insuranceInterval"::Interval )`)),
    ...offSetLimit,
  });

  const patientsHygieneWithOutInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: null,
      lastHygieneDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastHygieneDate" + INTERVAL '${account.hygieneInterval}')`),
      sequelize.literal(`'${startDate}' < ("lastHygieneDate" + INTERVAL '${account.hygieneInterval}')`)),
    ...offSetLimit,
  });


  const patientsRecallWithInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: {
        $ne: null,
      },
      lastRecallDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastRecallDate" + "insuranceInterval"::Interval)`),
      sequelize.literal(`'${startDate}' < ("lastRecallDate" + "insuranceInterval"::Interval )`)),
    ...offSetLimit,
  });

  const patientsRecallWithOutInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: null,
      lastRecallDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastRecallDate" + INTERVAL '${account.hygieneInterval}')`),
      sequelize.literal(`'${startDate}' < ("lastRecallDate" + INTERVAL '${account.hygieneInterval}')`)),
    ...offSetLimit,
  });

  const patientsHygiene = patientsHygieneWithInterval.concat(patientsHygieneWithOutInterval);
  const patientsRecall = patientsRecallWithInterval.concat(patientsRecallWithOutInterval);
  const patients = removeRecallDuplicates(patientsHygiene, patientsRecall);

  return {
    count: patients.length,
    rows: patients,
  };
}

export function CancelledAppointmentsFilter(accountId, offSetLimit) {
  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
    },
    include: {
      model: Appointment,
      as: 'appointments',
      where: {
        accountId,
        isCancelled: true,
        isDeleted: false,
        isPending: false,
        startDate: {
          $between: [moment().subtract(48, 'hours').toISOString(), new Date()],
        },
        patientId: {
          $not: null,
        },
      },
      attributes: [],
      required: true,
      duplicating: false,
    },
  }, offSetLimit));
}

export function MissedPreAppointed(accountId, offSetLimit) {
  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
      nextApptId: null,
      nextApptDate: null,
      lastApptDate: {
        $between: [moment().subtract(30, 'days').toISOString(), new Date()],
      },
    },
  }, offSetLimit));
}

export function UnConfirmedPatientsFilter(accountId, offSetLimit, smFilter) {
  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
      nextApptId: {
        $not: null,
      },
    },
    include: [{
      model: Appointment,
      as: 'nextAppt',
      where: {
        startDate: {
          $between: [new Date(), moment().add(smFilter.days, 'days').toISOString()],
        },
        isPatientConfirmed: false,
        isCancelled: false,
        isDeleted: false,
        isPending: false,
      },
      attributes: ['startDate'],
      groupBy: ['startDate'],
      required: true,
    }, {
      model: Appointment,
      as: 'lastAppt',
      attributes: ['startDate'],
      groupBy: ['startDate'],
      required: false,
    }],
  }, offSetLimit));
}
