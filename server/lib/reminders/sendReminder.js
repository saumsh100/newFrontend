
import twilio from '../../config/twilio';
import { host, protocol, myHost } from '../../config/globals';
import dateFormatter from '../../../iso/helpers/dateTimezone/dateFormatter';
import createReminderText, { getReminderTemplateName } from './createReminderText';
import { sendTemplate } from '../mail';
import { buildAppointmentEvent } from '../ics';
import { formatPhoneNumber } from '../../util/formatters';
import { sendMessage } from '../../services/chat';
import renderFamilyRemindersHTML from '../emailTemplates/familyReminders';
import createFamilyReminderText from './createFamilyReminderText';

export function getIsConfirmable(appointment, reminder) {
  if (!reminder.isConfirmable) return false;

  if (reminder.isCustomConfirm) {
    return !appointment.isPreConfirmed || !appointment.isPatientConfirmed;
  }

  return !appointment.isPatientConfirmed;
}

function getFamilyConfirmationText(familyHead, sentRemindersPatients, startDate, account, action) {
  if (sentRemindersPatients.length > 1) {
    return `Thanks ${familyHead.firstName}! Your family's appointments with ${account.name} ` +
  `on ${startDate} are ${action}. `;
  }
  
  const { patient, appointment } = sentRemindersPatients[0];
  const startTime = dateFormatter(appointment.startDate, account.timezone, 'h:mma'); // 2:15pm
  return `Thanks ${familyHead.firstName}! ${patient.firstName}'s appointment with ${account.name} ` +
  `on ${startDate} at ${startTime} is ${action}.`;
}

export const createConfirmationText = ({ patient, account, appointment, reminder, isFamily, sentRemindersPatients }) => {
  const startDate = dateFormatter(appointment.startDate, account.timezone, 'MMMM Do'); // Saturday, July 9th
  const startTime = dateFormatter(appointment.startDate, account.timezone, 'h:mma'); // 2:15pm
  const action = reminder.isCustomConfirm ? 'pre-confirmed' : 'confirmed';
  return isFamily ? getFamilyConfirmationText(patient, sentRemindersPatients, startDate, account, action) : `Thanks ${patient.firstName}! Your appointment with ${account.name} ` +
    `on ${startDate} at ${startTime} is ${action}. `;
};

const BASE_URL = `${protocol}://${host}/twilio/voice/sentReminders`;
const generateCallBackUrl = ({ account, appointment, patient, sentReminder }) => {
  const startDate = dateFormatter(appointment.startDate, account.timezone, 'MMMM Do'); // Saturday, July 9th
  const startTime = dateFormatter(appointment.startDate, account.timezone, 'h:mma'); // 2:15pm
  return `${BASE_URL}/${sentReminder.id}/?firstName=${encodeURIComponent(patient.firstName)}&clinicName=${encodeURIComponent(account.name)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}`;
};

export default {
  // Send Appointment Reminder text via Twilio
  sms({ account, appointment, patient, reminder, sentReminder, currentDate, dependants }) {
    const { isConfirmable } = sentReminder;
    const bodyProps = {
      patient,
      account,
      appointment,
      reminder,
      currentDate,
      isConfirmable,
      dependants,
    };
    const body = (dependants && dependants.length > 0) ? createFamilyReminderText(bodyProps) : createReminderText(bodyProps);
    return sendMessage(patient.mobilePhoneNumber, body, account.id);
  },

  // Send Appointment Reminder call via Twilio
  phone({ account, appointment, patient, sentReminder }) {
    // TODO: add phoneNumber logic for patient
    return twilio.makeCall({
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      url: generateCallBackUrl({
        account,
        appointment,
        patient,
        sentReminder,
      }),
    });
  },

  // Send Appointment Reminder email via Mandrill (MailChimp)
  email({ account, appointment, patient, sentReminder, reminder, dependants }) {
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
      content: getAppointmentDate(appointment.startDate, account.timezone),
    },
    {
      name: 'APPOINTMENT_TIME',
      content: getAppointmentTime(appointment.startDate, account.timezone),
    }] : [];

    const attachmentsObj = appointment ? {
      attachments: [
        {
          type: 'application/octet-stream',
          name: 'appointment.ics',
          content: new Buffer(buildAppointmentEvent({
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
  },
};

/*

 - First notification = 7 days ahead
 - Same Day notification = 12 hours ahead
 - Assume all preferences for now
 */

function getAppointmentDate(date, timezone) {
  return dateFormatter(date, timezone, 'dddd, MMMM Do YYYY');
}

function getAppointmentTime(date, timezone) {
  return dateFormatter(date, timezone, 'h:mm a');
}
