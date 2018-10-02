
import moment from 'moment';
import { Appointment, Patient } from '../../_models';
import Appointments from '../../../client/entities/models/Appointments';

export async function LateAppointmentsFilter(accountId, offSetLimit, smFilter) {
  let startDate = moment()
    .subtract(smFilter.startMonth, 'months')
    .toISOString();
  let endDate = moment()
    .subtract(smFilter.endMonth, 'months')
    .toISOString();
  if (smFilter.startMonth < 0) {
    startDate = moment()
      .add(smFilter.endMonth * -1, 'months')
      .toISOString();
    endDate = moment()
      .add(smFilter.startMonth * -1, 'months')
      .toISOString();
  }

  const baseWhereQuery = { accountId };

  return Patient.findAndCountAll({
    raw: true,
    where: {
      ...baseWhereQuery,
      $or: {
        dueForHygieneDate: {
          $not: null,
          $gte: startDate,
          $lt: endDate,
        },
        dueForRecallExamDate: {
          $not: null,
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    ...offSetLimit,
  });
}

export function CancelledAppointmentsFilter(accountId, offSetLimit) {
  return Patient.findAndCountAll(Object.assign(
    {
      raw: true,
      where: { accountId },
      include: {
        model: Appointment,
        as: 'appointments',
        where: {
          accountId,
          isCancelled: true,
          isDeleted: false,
          isMissed: false,
          isPending: false,
          startDate: {
            $between: [
              moment()
                .subtract(48, 'hours')
                .toISOString(),
              new Date(),
            ],
          },
          patientId: { $not: null },
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
    },
    offSetLimit,
  ));
}

export function MissedPreAppointed(accountId, offSetLimit) {
  return Patient.findAndCountAll(Object.assign(
    {
      raw: true,
      where: {
        accountId,
        nextApptId: null,
        nextApptDate: null,
        lastApptDate: {
          $between: [
            moment()
              .subtract(30, 'days')
              .toISOString(),
            new Date(),
          ],
        },
      },
    },
    offSetLimit,
  ));
}

export function UnConfirmedPatientsFilter(accountId, offSetLimit, smFilter) {
  return Patient.findAndCountAll(Object.assign(
    {
      raw: true,
      where: {
        accountId,
        nextApptId: { $not: null },
      },
      include: [
        {
          model: Appointment,
          as: 'nextAppt',
          where: {
            startDate: {
              $between: [
                new Date(),
                moment()
                  .add(smFilter.days, 'days')
                  .toISOString(),
              ],
            },
            ...Appointments.getCommonSearchAppointmentSchema({ isPatientConfirmed: false }),
          },
          attributes: ['startDate'],
          groupBy: ['startDate'],
          required: true,
        },
        {
          model: Appointment,
          as: 'lastAppt',
          attributes: ['startDate'],
          groupBy: ['startDate'],
          required: false,
        },
      ],
    },
    offSetLimit,
  ));
}
