
import sendEmail from './sendReminder/sendEmail';
import sendSms from './sendReminder/sendSms';
import phoneCall from './sendReminder/phoneCall';

/**
 * Perform a check if appointment is confirmed.
 * @param appointment
 * @param reminder
 * @return {boolean}
 */
export function getIsConfirmable(
  { isPreConfirmed, isPatientConfirmed },
  { isConfirmable, isCustomConfirm },
) {
  if (isConfirmable) {
    return (isCustomConfirm && !isPreConfirmed) || !isPatientConfirmed;
  }
  return false;
}

/**
 * FACADE object for the functions that actually send the reminders so that we can interface them by
 * `SendReminder.sms()` or more specifically because we use the data dynamically call the correct
 * function `SendReminder[channel]()` where channel is a string with the function name.
 */
export default {
  sms: sendSms,
  phone: phoneCall,
  email: sendEmail,
};
