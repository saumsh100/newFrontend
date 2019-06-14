
import { dateFormatter } from '@carecru/isomorphic';

/**
 * Creates the confirmation text based on given parameters.
 * @param patient
 * @param account
 * @param appointment
 * @param reminder
 * @param isFamily
 * @param sentRemindersPatients
 * @return {string}
 */
export default function createConfirmationText({
  patient,
  account,
  appointment,
  reminder,
  isFamily,
  sentRemindersPatients,
}) {
  const action = reminder.isCustomConfirm ? 'pre-confirmed' : 'confirmed';
  return isFamily
    ? getFamilyConfirmationText(patient, sentRemindersPatients, account, action)
    : getPatientConfirmationText(
      patient.firstName,
      appointment.startDate,
      account,
      action,
    );
}

/**
 * Generate the appointment confirmation text for family patient.
 * @param familyHead
 * @param sentRemindersPatients
 * @param account
 * @param action
 * @return {string}
 */
function getFamilyConfirmationText(
  familyHead,
  sentRemindersPatients,
  account,
  action,
) {
  const [{
    patient: { firstName },
    appointment: { startDate },
  }] = sentRemindersPatients;
  const sDate = dateFormatter(startDate, account.timezone, 'MMMM Do');

  if (sentRemindersPatients.length > 1) {
    return `Thanks ${familyHead.firstName}! Your family's appointments with ${
      account.name
    } on ${sDate} are ${action}.`;
  }

  const startTime = dateFormatter(startDate, account.timezone, 'h:mma');
  return `Thanks ${familyHead.firstName}! ${firstName}'s appointment with ${
    account.name
  } on ${sDate} at ${startTime} is ${action}.`;
}

/**
 * Generate the appointment confirmation text for patient.
 * @param firstName
 * @param startDate
 * @param account { timezone, name }
 * @param action
 * @return {string}
 */
function getPatientConfirmationText(
  firstName,
  startDate,
  { timezone, name },
  action,
) {
  const sDate = dateFormatter(startDate, timezone, 'MMMM Do');
  const sTime = dateFormatter(startDate, timezone, 'h:mma');
  return `Thanks ${firstName}! Your appointment with ${name} on ${sDate} at ${sTime} is ${action}.`;
}
