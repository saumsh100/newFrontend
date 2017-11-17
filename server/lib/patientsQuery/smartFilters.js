
import moment from 'moment';
import { Appointment, Patient } from '../../_models';

export function LateAppointmentsFilter(accountId, offSetLimit, smFilter) {
  const startMonthsOut = moment().subtract(smFilter.startMonth, 'months').toISOString();
  const endMonthsOut = moment().subtract(smFilter.endMonth, 'months').toISOString();

  console.log(offSetLimit);

  return Patient.findAndCountAll(Object.assign({
    raw: true,
    where: {
      accountId,
      nextApptId: null,
      nextApptDate: null,
      lastApptDate: {
        $between: [startMonthsOut, endMonthsOut],
      },
    },
  }, offSetLimit));
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
