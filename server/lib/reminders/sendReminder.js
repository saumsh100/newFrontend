
import twilioClient from '../../config/twilio';
import { host, protocol, myHost } from '../../config/globals';
import dateFormatter from '../../../iso/helpers/dateTimezone/dateFormatter';
import createReminderText, { getReminderTemplateName } from './createReminderText';
import { sendTemplate } from '../mail';
import { buildAppointmentEvent } from '../ics';
import { formatPhoneNumber } from '../../util/formatters';
import { sendMessage } from '../../services/chat';
import renderFamilyRemindersHTML from '../emailTemplates/familyReminders';
import createFamilyReminderText from './createFamilyReminderText';

/**
 * Generate the appointment confirmation text for family patient.
 * @param familyHead
 * @param sentRemindersPatients
 * @param account
 * @param action
 * @return {string}
 */
function getFamilyConfirmationText(familyHead, sentRemindersPatients, account, action) {
  const { patient: { firstName }, appointment: { startDate } } = sentRemindersPatients[0];
  const sDate = dateFormatter(startDate, account.timezone, 'MMMM Do');

  if (sentRemindersPatients.length > 1) {
    return `Thanks ${familyHead.firstName}! Your family's appointments with ${account.name} on ${sDate} are ${action}.`;
  }

  const startTime = dateFormatter(startDate, account.timezone, 'h:mma');
  return `Thanks ${familyHead.firstName}! ${firstName}'s appointment with ${account.name} on ${sDate} at ${startTime} is ${action}.`;
}

/**
 * Generate the appointment confirmation text for patient.
 * @param firstName
 * @param startDate
 * @param account { timezone, name }
 * @param action
 * @return {string}
 */
function getPatientConfirmationText(firstName, startDate, { timezone, name }, action) {
  const sDate = dateFormatter(startDate, timezone, 'MMMM Do');
  const sTime = dateFormatter(startDate, timezone, 'h:mma');
  return `Thanks ${firstName}! Your appointment with ${name} on ${sDate} at ${sTime} is ${action}.`;
}

/**
 * Generate the callBack URL for phone calls.
 * @param param.account
 * @param param.appointment
 * @param param.patient
 * @param param.sentReminder
 * @return {string} the built callback url
 */
function generateCallBackUrl({ account, appointment, patient, sentReminder }) {
  const BASE_URL = `${protocol}://${host}/twilio/voice/sentReminders`;
  const startDate = dateFormatter(appointment.startDate, account.timezone, 'MMMM Do');
  const startTime = dateFormatter(appointment.startDate, account.timezone, 'h:mma');
  return `${BASE_URL}/${sentReminder.id}/?firstName=${encodeURIComponent(patient.firstName)}&clinicName=${encodeURIComponent(account.name)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}`;
}

/**
 * Send the SMS reminder.
 * @param account
 * @param appointment
 * @param patient
 * @param reminder
 * @param sentReminder { isConfirmable }
 * @param currentDate
 * @param dependants
 * @return {Promise}
 */
function sendSms({
  account,
  appointment,
  patient,
  reminder,
  sentReminder: { isConfirmable },
  currentDate,
  dependants,
}) {
  const bodyProps = {
    patient,
    account,
    appointment,
    reminder,
    currentDate,
    isConfirmable,
    dependants,
  };
  const body = (dependants && dependants.length > 0)
    ? createFamilyReminderText(bodyProps)
    : createReminderText(bodyProps);
  return sendMessage(patient.mobilePhoneNumber, body, account.id);
}

/**
 * Make a phone call for reminder.
 * @param account
 * @param appointment
 * @param patient
 * @param sentReminder
 * @return {*}
 */
function phoneCall({ account, appointment, patient, sentReminder }) {
  // TODO: add phoneNumber logic for patient
  return twilioClient.makeCall({
    to: patient.mobilePhoneNumber,
    from: account.twilioPhoneNumber,
    url: generateCallBackUrl({
      account,
      appointment,
      patient,
      sentReminder,
    }),
  });
}

/**
 * Send a reminder email.
 * @param account
 * @param appointment
 * @param patient
 * @param sentReminder
 * @param reminder
 * @param dependants
 * @return {Promise}
 */
function sendEmail({ account, appointment, patient, sentReminder, reminder, dependants }) {
  const { isConfirmable } = sentReminder;

  const html = (dependants && dependants.length > 0) && renderFamilyRemindersHTML({
    account,
    patient,
    appointment,
    sentReminder,
    familyMembers: dependants,
    isConfirmable,
  });

  const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

  const appointmentMergeVars = appointment ? [{
    name: 'APPOINTMENT_DATE',
    content: dateFormatter(appointment.startDate, account.timezone, 'dddd, MMMM Do YYYY'),
  },
  {
    name: 'APPOINTMENT_TIME',
    content: dateFormatter(appointment.startDate, account.timezone, 'h:mm a'),
  }] : [];

  const attachmentsObj = appointment ? {
    attachments: [
      {
        type: 'application/octet-stream',
        name: 'appointment.ics',
        content: Buffer.from(buildAppointmentEvent({
          appointment,
          patient,
          account,
        })).toString('base64'),
      },
    ],
  } : {};

  return sendTemplate({
    patientId: patient.id,
    toEmail: patient.email,
    fromName: account.name,
    replyTo: account.contactEmail,
    subject: html ? 'Family Reminder' : 'Appointment Reminder',
    templateName: html ? 'test-html-template' : getReminderTemplateName({
      isConfirmable,
      reminder,
      account,
    }),
    html,
    mergeVars: [
      {
        name: 'PRIMARY_COLOR',
        content: account.bookingWidgetPrimaryColor || '#206477',
      },
      {
        name: 'ACCOUNT_LOGO_URL',
        content: accountLogoUrl,
      },
      {
        name: 'CONFIRMATION_URL',
        // TODO: we might have to make this a token if UUID is too easy to guess...
        content: `${protocol}://${myHost}/sentReminders/${sentReminder.id}/confirm`,
      },
      {
        name: 'ACCOUNT_CLINICNAME',
        content: account.name,
      },
      {
        name: 'ACCOUNT_CONTACTEMAIL',
        content: account.contactEmail,
      },
      {
        name: 'ACCOUNT_WEBSITE',
        content: account.website,
      },
      {
        name: 'ACCOUNT_PHONENUMBER',
        content: formatPhoneNumber(account.phoneNumber),
      },
      {
        name: 'PATIENT_FIRSTNAME',
        content: patient.firstName,
      },
      {
        name: 'ACCOUNT_STREET',
        content: account.address.street,
      },
      {
        name: 'ACCOUNT_ADDRESS',
        content: account.address.street,
      },
      {
        name: 'ACCOUNT_CITY',
        content: `${account.address.city}, ${account.address.state}`,
      },
      {
        name: 'FACEBOOK_URL',
        content: account.facebookUrl,
      },
      {
        name: 'GOOGLE_URL',
        content: `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}`,
      },
      ...appointmentMergeVars,
    ],
    ...attachmentsObj,
  });
}

/**
 * Perform a check if appointment is confirmed.
 * @param appointment
 * @param reminder
 * @return {boolean}
 */
export function getIsConfirmable({
  isPreConfirmed,
  isPatientConfirmed,
}, {
  isConfirmable,
  isCustomConfirm,
}) {
  if (isConfirmable) {
    return (isCustomConfirm && !isPreConfirmed) || !isPatientConfirmed;
  }
  return false;
}

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
export function createConfirmationText({
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
    : getPatientConfirmationText(patient.firstName, appointment.startDate, account, action);
}

export default {
  sms: sendSms,
  phone: phoneCall,
  email: sendEmail,
};

/*
 - First notification = 7 days ahead
 - Same Day notification = 12 hours ahead
 - Assume all preferences for now
 */
