
import { Appointment, SentRecall, Patient } from '../../_models';

export default async function linkRequestWithPendingAppointment(requestData) {
  const { sentRecallId } = requestData;
  if (!sentRecallId) return false;

  const sentRecall = await SentRecall.findOne({
    where: {
      id: sentRecallId,
    },

    include: [{
      model: Patient,
      as: 'patient',
      required: true,
    }],
  });

  if (!sentRecall) return false;
  const { patient } = sentRecall;
  const pendingApptId = sentRecall.isHygiene ?
    patient.hygienePendingAppointmentId :
    patient.recallPendingAppointmentId;

  const appointment = await Appointment.findById(pendingApptId);
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
    endDate: requestData.endDate,
    isSyncedWithPms: false,
    reason: Appointment.REQUEST_REASON,
  });

  return true;
}
