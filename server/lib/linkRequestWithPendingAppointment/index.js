import { SentRecall, Appointment } from '../../_models';

export default async function linkRequestWithPendingAppointment(sentRecallId) {
  const sentRecall = await SentRecall.findOne({
    where: {
      id: sentRecallId,
    },
  });

  if (!sentRecall) {
    return {};
  }

  const [appointment] = await Appointment.findAll({
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

  if (!appointment) {
    return {};
  }

  await appointment.update({
    isDeleted: true,
    isSyncedWithPms: false,
  });

  return {
    patientId: appointment.patientId,
    suggestedPractitionerId: appointment.practitionerId,
    suggestedChairId: appointment.chairId,
    note: appointment.note,
  };
}
