
import moment from 'moment';
import { Appointment, Patient, sequelize, DeliveredProcedure, Request } from '../../_models';

export function LateAppointmentsFilter(accountId, offSetLimit, order, smFilter) {
  const startMonthsOut = moment().subtract(smFilter.startMonth, 'months').toISOString();
  const endMonthsOut = moment().subtract(smFilter.endMonth, 'months').toISOString();

  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
      nextApptId: null,
    },
    include: {
      model: Appointment,
      as: 'lastAppt',
      where: {
        startDate: {
          $between: [startMonthsOut, endMonthsOut],
        },
      },
      attributes: ['startDate'],
      groupBy: ['startDate'],
    },
  }, offSetLimit));
}

export function CancelledAppointmentsFilter(accountId, offSetLimit, order, smFilter) {
  return Appointment.findAndCountAll(Object.assign({
    raw: true,
    nest: true,
    where: {
      accountId,
      isCancelled: true,
      isDeleted: false,
      startDate: {
        $between: [moment().subtract(48, 'hours').toISOString(), new Date()],
      },
      patientId: {
        $ne: null,
      },
    },
    include: {
      model: Patient,
      as: 'patient',
      required: true,
    },
  }, offSetLimit));
}

export function MissedPreAppointed(accountId, offSetLimit, order, smFilter) {
  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
      nextApptId: null,
    },
    include: {
      model: Appointment,
      as: 'lastAppt',
      where: {
        startDate: {
          $between: [moment().subtract(30, 'days').toISOString(), new Date()],
        },
      },
      attributes: ['startDate'],
      groupBy: ['startDate'],
    },
  }, offSetLimit));
}

export function UnConfirmedPatientsFilter(accountId, offSetLimit, order, smFilter) {
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
