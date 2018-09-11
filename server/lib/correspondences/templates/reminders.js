
import { templatesFactory } from './helpers';

/**
 * Template function for reminders correspondences.
 * Takes action, reminderType and firsName of the PoC.
 *
 * @param {string} param.action
 * @param {string} param.reminderType
 * @param {string} param.firstName
 */
const reminderTemplate =
  ({ action, reminderType, contactedPatientName, appointmentPatientName }) => ({
    sent: {
      single: `Sent "${reminderType}" Reminder for Appointment via CareCru`,
      familyOther: `Sent "${reminderType}" Family Reminder to ${contactedPatientName} for Appointment via CareCru`,
      familyPOC: `Sent "${reminderType}" Family Reminder for Appointment via CareCru`,
    },
    confirmed: {
      single: `${contactedPatientName} ${action} "${reminderType}" Reminder for Appointment via CareCru`,
      familyOther: `${contactedPatientName} ${action} "${reminderType}" Family Reminder for ${appointmentPatientName}'s Appointment via CareCru`,
      familyPOC: `${contactedPatientName} ${action} "${reminderType}" Family Reminder for Appointment via CareCru`,
    },
  });
  
export default templatesFactory(reminderTemplate);
