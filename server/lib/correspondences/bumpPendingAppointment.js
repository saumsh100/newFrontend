
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
        model: Account,
        as: 'account',
        required: true,
      },
      {
        model: Patient,
        as: 'patient',
        required: true,
      },
    ],
  });

  if (!sentRecall) return null;
  const { account, patient } = sentRecall;
  const pendingApptId = sentRecall.isHygiene ?
    patient.hygienePendingAppointmentId :
    patient.recallPendingAppointmentId;

  const appointment = await Appointment.findById(pendingApptId);
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
