
import twilio from '../../config/twilio';
import { host } from '../../config/globals';
import { sendConfirmationReminder } from '../mail';
import { buildAppointmentEvent } from '../ics';

const PHONE_CALLBACK_URL = `https://${host}/twilio/voice`;
const createReminderText = ({ patient, account, appointment }) => (`
  ${patient.firstName}, your next appointment with ${account.name}
  is ${appointment.startDate} at ${appointment.startTime}. Reply 'C' to
  confirm your appointment.
`);

export default {
  // Send Appointment Reminder text via Twilio
  sms: ({ patient, account, appointment }) => {
    // TODO: add phoneNumber logic for patient
    return twilio.sendMessage({
      to: patient.phoneNumber,
      from: account.twilioPhoneNumber,
      body: createReminderText({ patient, account, appointment }),
    });
  },

  // Send Appointment Reminder call via Twilio
  phone: ({ patient, account }) => {
    // TODO: add phoneNumber logic for patient
    // TODO; add appointment and account data to URL
    return twilio.makeCall({
      to: patient.phoneNumber,
      from: account.twilioPhoneNumber,
      url: PHONE_CALLBACK_URL,
    });
  },

  // Send Appointment Reminder email via Mandrill (MailChimp)
  email: ({ patient, account, appointment }) => {
    // TODO: create token, then send reminder with tokenId
    return sendConfirmationReminder({
      toEmail: patient.email,
      fromName: account.name,
      mergeVars: [
        {
          name: 'CONFIRMATION_URL',
          content: `https://${host}/confirmation/${123123123123}`,
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
          type: 'text/calendar',
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


