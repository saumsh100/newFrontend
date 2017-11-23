
import moment from 'moment-timezone';

export default function createReminderText({ patient, account, appointment }) {
  const mDate = moment(appointment.startDate);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm

  const alreadyConfirmed = appointment.isPatientConfirmed;
  if (alreadyConfirmed) {
    return `Hi ${patient.firstName}, this is just a friendly reminder that your next appointment with ${account.name} ` +
      `is on ${startDate} at ${startTime}.`;
  } else {
    return `Hi ${patient.firstName}, this is just a friendly reminder that your next appointment with ${account.name} ` +
      `is on ${startDate} at ${startTime}. Reply "C" to ` +
      'confirm your appointment.';
  }
}
