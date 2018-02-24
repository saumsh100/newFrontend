import moment from 'moment';
import { Account, SentRecall, Appointment } from '../../_models';
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
    raw: true,
  });

  const appointment = await Appointment.findAll({
    where: {
      startDate: {
        $gt: sentRecall.createdAt,
      },
      patientId: sentRecall.patientId,
      isPending: true,
      isRecall: true,
    },
    limit: 1,
    order: [['startDate', 'ASC']],
  });

  const account = await Account.findOne({
    where: {
      id: sentRecall.accountId,
    },
  });

  if (appointment[0]) {
    const intervalObject = convertIntervalStringToObject(account.bumpInterval);

    await appointment[0].update({
      startDate: moment(appointment[0].startDate).add(intervalObject).toISOString(),
      endDate: moment(appointment[0].endDate).add(intervalObject).toISOString(),
      isSyncedWithPms: false,
    });

    return appointment[0].id;
  }

  return null;
}
