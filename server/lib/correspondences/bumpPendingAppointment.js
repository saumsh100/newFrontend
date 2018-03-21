
import moment from 'moment';
import { Account, Appointment, Patient, SentRecall } from '../../_models';
import { convertIntervalStringToObject } from '../../util/time';

/**
 * [bumpPendingAppointment bumps the closest future pending appointment]
 * @param  {[string]} sentRecallId [string uuid of the sen Recall]
 * @return {[string]}              [the pending Appointment Id that got changed
 * if any]
 */
export default async function bumpPendingAppointment(sentRecallId) {
  const sentRecall = await SentRecall.findOne({
    where: {
      id: sentRecallId,
    },

    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
      },
      {
        model: Account,
        as: 'account',
        required: true,
      },
    ],
  });

  if (!sentRecall) return null;
  const { patient, account } = sentRecall;
  const dueDate = sentRecall.isHygiene ? patient.dueForHygieneDate : patient.dueForRecallExamDate;

  let startOfDay;
  let endOfDay;
  if (account.timezone) {
    const mDay = moment.tz(dueDate, account.timezone);
    startOfDay = mDay.startOf('day').toISOString();
    endOfDay = mDay.endOf('day').toISOString();
  } else {
    const mDay = moment(dueDate);
    startOfDay = mDay.startOf('day').toISOString();
    endOfDay = mDay.endOf('day').toISOString();
  }

  const [appointment] = await Appointment.findAll({
    where: {
      patientId: sentRecall.patientId,
      isPending: true,
      startDate: {
        $between: [startOfDay, endOfDay],
      },
    },
    limit: 1,
    order: [['startDate', 'ASC']],
  });

  if (!appointment) return null;

  const intervalObject = convertIntervalStringToObject(account.bumpInterval);
  const currentStartDate = moment(appointment.startDate);
  const durationMinutes = moment(appointment.endDate).diff(currentStartDate, 'minutes');

  const newStartDate = moment(sentRecall.createdAt)
    .add(intervalObject)
    .hours(currentStartDate.hours())
    .minutes(currentStartDate.minutes())
    .toISOString();

  await appointment.update({
    startDate: newStartDate,
    endDate: moment(newStartDate).add(durationMinutes, 'minutes').toISOString(),
    isSyncedWithPms: false,
  });

  return appointment.id;
}
