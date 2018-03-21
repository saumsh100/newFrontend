
import moment from 'moment';
import 'moment-timezone';
import { Appointment, Account, SentRecall, Patient } from '../../_models';

export default async function linkRequestWithPendingAppointment(requestData) {
  const { sentRecallId } = requestData;
  if (!sentRecallId) return false;

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

  if (!sentRecall) return false;
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

  // This is the pending appointment
  // In the future we will probably just stash that pendingAppointmentId on the Patient model
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

  if (!appointment) return false;

  // Append the note from the booking request if there is one
  let { note } = appointment;
  if (requestData.note) {
    note += `\n- Patient says: ${requestData.note}`;
  }

  // We update the pending appointment to be like a booking request so that
  // they still have all of the data
  await appointment.update({
    note,
    isPending: false,
    startDate: requestData.startDate,
    isSyncedWithPms: false,
    reason: Appointment.REQUEST_REASON,
  });

  return true;
}
