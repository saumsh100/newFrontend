
import moment from 'moment-timezone';

export default function createRecallText({ patient, account, recall }) {
  const isPre = recall.lengthSeconds >= 0;
  const dueDate = moment().add(recall.lengthSeconds, 'seconds').format('dddd, MMMM Do');
  if (isPre) {
    return `Hi ${patient.firstName}, this is ${account.name}. We're reaching out because you're ` +
      `almost due for your next dental appointment. You can schedule your appointment for anytime after ` +
      `${dueDate}, by clicking this link: ${account.website}?cc=book`;
  } else {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${account.website}?cc=book`;
  }
}
