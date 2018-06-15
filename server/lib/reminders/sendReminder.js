
import moment from 'moment-timezone';
import twilio from '../../config/twilio';
import { host, protocol, myHost } from '../../config/globals';
import createReminderText, { getReminderTemplateName } from './createReminderText';
import { sendTemplate } from '../mail';
import { buildAppointmentEvent } from '../ics';
import { formatPhoneNumber } from '../../util/formatters';

export function getIsConfirmable(appointment, reminder) {
  if (reminder.isCustomConfirm) {
    return !appointment.isPreConfirmed || !appointment.isPatientConfirmed;
  } else {
    return !appointment.isPatientConfirmed;
  }
}

export const createConfirmationText = ({ patient, account, appointment, reminder }) => {
  const mDate = moment.tz(appointment.startDate, account.timezone);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  const action = reminder.isCustomConfirm ? 'pre-confirmed' : 'confirmed';
  return `Thanks ${patient.firstName}! Your appointment with ${account.name} ` +
    `on ${startDate} at ${startTime} is ${action}. `;
};

const BASE_URL = `${protocol}://${host}/twilio/voice/sentReminders`;
const generateCallBackUrl = ({ account, appointment, patient, sentReminder }) => {
  const mDate = moment.tz(appointment.startDate, account.timezone);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  return `${BASE_URL}/${sentReminder.id}/?firstName=${encodeURIComponent(patient.firstName)}&clinicName=${encodeURIComponent(account.name)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}`;
};

export default {
  // Send Appointment Reminder text via Twilio
  sms({ account, appointment, patient, reminder, currentDate }) {
    // TODO: add phoneNumber logic for patient
    return twilio.sendMessage({
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      body: createReminderText({ patient, account, appointment, reminder, currentDate }),
    });
  },

  // Send Appointment Reminder call via Twilio
  phone({ account, appointment, patient, sentReminder }) {
    // TODO: add phoneNumber logic for patient
    return twilio.makeCall({
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      url: generateCallBackUrl({ account, appointment, patient, sentReminder }),
    });
  },

  // Send Appointment Reminder email via Mandrill (MailChimp)
  email({ account, appointment, patient, sentReminder, reminder }) {
    const isConfirmable = getIsConfirmable(appointment, reminder) ? 'true' : null;
    const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
    return sendTemplate({
      patientId: patient.id,
      toEmail: patient.email,
      fromName: account.name,
      replyTo: account.contactEmail,
      subject: 'Appointment Reminder',
      templateName: getReminderTemplateName({ isConfirmable, reminder }),
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
          name: 'APPOINTMENT_DATE',
          content: getAppointmentDate(appointment.startDate, account.timezone),
        },
        {
          name: 'APPOINTMENT_TIME',
          content: getAppointmentTime(appointment.startDate, account.timezone),
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
      ],

      attachments: [
        {
          type: 'application/octet-stream',
          name: `appointment.ics`,
          content: new Buffer(buildAppointmentEvent({ appointment, patient, account })).toString('base64'),
        },
      ],
    });
  },
};

/*

 - First notification = 7 days ahead
 - Same Day notification = 12 hours ahead
 - Assume all preferences for now
 */

function getAppointmentDate(date, timezone) {
  return moment.tz(date, timezone).format('dddd, MMMM Do YYYY');
}

function getAppointmentTime(date, timezone) {
  return moment.tz(date, timezone).format('h:mm a');
}


