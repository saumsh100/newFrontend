
import { dateFormatter } from '@carecru/isomorphic';
import renderTemplates from './renderTemplates';

// import { account, appointment, patient, familyMembers } from './entities';

// Family Reminder templates object
const familyTemplates = {
  single: {
    unconfirmed: 'FamilyRemindersForAnotherSingle',
    confirmed: 'FamilyRemindersForAnotherSingleConfirmed',
  },

  multiple: {
    unconfirmed: 'FamilyRemindersForAnotherMultiple',
    confirmed: 'FamilyRemindersForAnotherMultipleConfirmed',
  },

  self: {
    unconfirmed: 'FamilyRemindersForSelfAndOthers',
    confirmed: 'FamilyRemindersForSelfAndOthersConfirmed',
  },
};

/**
 * getTemplateName retrieves the template that corresponds to the number of family members in the reminder
 * and whether or not the point of contact has an appointment or not.
 * @param {*} sentReminder
 * @param {*} appointment
 * @param {*} familyMembers
 */
function getTemplateName(appointment, familyMembers) {
  if (appointment) {
    return 'self';
  } else if (familyMembers.length === 1 && !appointment) {
    return 'single';
  }
  return 'multiple';
}

/**
 * getAppointmentDate gets the date of the families appointment. Currently all members
 * of the family will have an appointment on the same date. This date is calculated based
 * on the point of contacts appointment or the first family members appointment.
 * @param {*} appointment
 * @param {*} familyMembers
 * @param {*} timezone
 */
function getAppointmentDate(appointment, familyMembers, timezone) {
  if (appointment) {
    return dateFormatter(appointment.startDate, timezone, 'dddd, MMMM Do YYYY');
  }

  const famApptStartDate = familyMembers[0].appointment.startDate;
  return dateFormatter(famApptStartDate, timezone, 'dddd, MMMM Do YYYY');
}

/**
 * renderFamilyRemindersHTML generates the HTML for the family reminder template.
 * @param {*} params
 */
export default function renderFamilyRemindersHTML({ account, appointment, patient, familyMembers, isConfirmable }) {
  const confirmType = JSON.parse(isConfirmable) ? 'unconfirmed' : 'confirmed';

  const templateName = familyTemplates[getTemplateName(appointment, familyMembers)][confirmType];

  const html = renderTemplates({
    templateName,
    account,
    timezone: account.timezone,
    appointment,
    patient,
    familyMembers,
    appointmentDate: getAppointmentDate(appointment, familyMembers, account.timezone),
  });

  return html;
}
