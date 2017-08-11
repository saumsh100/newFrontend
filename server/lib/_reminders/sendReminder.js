
import moment from 'moment';
import twilio from '../../config/twilio';
import { host, protocol } from '../../config/globals';
import { sendConfirmationReminder } from '../mail';
import { buildAppointmentEvent } from '../ics';

export const createConfirmationText = ({ patient, account, appointment }) => {
  const mDate = moment(appointment.startDate);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  return `Thanks ${patient.firstName}! You appointment with ${account.name} ` +
    `on ${startDate} at ${startTime} is confirmed. `;
};

const BASE_URL = `https://${host}/twilio/voice/sentReminders`;
const createReminderText = ({ patient, account, appointment }) => {
  const mDate = moment(appointment.startDate);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  return `${patient.firstName}, your next appointment with ${account.name} ` +
    `is on ${startDate} at ${startTime}. Reply 'C' to ` +
    'confirm your appointment.';
};

const generateCallBackUrl = ({ account, appointment, patient, sentReminder }) => {
  const mDate = moment(appointment.startDate);
  const startDate = mDate.format('MMMM Do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  return `${BASE_URL}/${sentReminder.id}/?firstName=${encodeURIComponent(patient.firstName)}&clinicName=${encodeURIComponent(account.name)}&startDate=${encodeURIComponent(startDate)}&startTime=${encodeURIComponent(startTime)}`;
};

export default {
  // Send Appointment Reminder text via Twilio
  sms({ account, appointment, patient }) {
    // TODO: add phoneNumber logic for patient
    // return Promise.resolve(true);
    return twilio.sendMessage({
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      body: createReminderText({ patient, account, appointment }),
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
  email({ account, appointment, patient, sentReminder }) {
    return sendConfirmationReminder({
      toEmail: patient.email,
      fromName: account.name,
      mergeVars: [
        {
          name: 'CONFIRMATION_URL',
          // TODO: we might have to make this a token if UUID is too easy to guess...
          content: `${protocol}://${host}/sentReminders/${sentReminder.id}/confirm`,
        },
        {
          name: 'ACCOUNT_NAME',
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
          content: account.phoneNumber,
        },
        {
          name: 'APPOINTMENT_DATE',
          content: getAppointmentDate(appointment.startDate),
        },
        {
          name: 'APPOINTMENT_TIME',
          content: getAppointmentTime(appointment.startDate),
        },
        {
          name: 'PATIENT_FIRSTNAME',
          content: patient.firstName,
        },
      ],

      attachments: [
        {
          type: 'application/octet-stream',
          name: 'appointment.ics',
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

function getAppointmentDate(date) {
  return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
}

function getAppointmentTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}


