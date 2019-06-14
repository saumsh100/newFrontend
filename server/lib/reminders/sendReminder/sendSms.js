
import getSmsText from '../reminderTemplate/getSmsText';
import { sendMessage } from '../../../services/chat';

/**
 * Send the SMS reminder.
 * @param props.account
 * @param props.appointment
 * @param props.patient
 * @param props.reminder
 * @param props.sentReminder { isConfirmable }
 * @param props.currentDate
 * @param props.dependants
 * @return {Promise}
 */
export default async function sendSms({
  account,
  patient,
  sentReminder: { isConfirmable },
  ...props
}) {
  const bodyProps = {
    account,
    patient,
    isConfirmable,
    ...props,
  };

  const body = await getSmsText(bodyProps);
  return sendMessage(patient.cellPhoneNumber, body, account.id);
}
