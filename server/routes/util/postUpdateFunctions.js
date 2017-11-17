import { Chat } from '../../_models';

export async function updateChatAfterPatient(patient, updateData) {
  const phoneNumber = updateData.mobilePhoneNumber;
  if (phoneNumber !== patient.mobilePhoneNumber) {
    const chat = await Chat.findAll({
      where: {
        accountId: patient.accountId,
        patientId: patient.id,
      },
    });

    if (chat[0]) {
      chat[0].update({ patientPhoneNumber: patient.mobilePhoneNumber });
    }
  }
}
