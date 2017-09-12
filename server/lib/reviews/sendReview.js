
import moment from 'moment-timezone';
import twilio from '../../config/twilio';
import { host, protocol } from '../../config/globals';
import { sendReview } from '../mail';
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
  /*sms({ account, appointment, patient }) {
    // TODO: add phoneNumber logic for patient
    return twilio.sendMessage({
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      body: createReminderText({ patient, account, appointment }),
    });
  },*/

  // Send Appointment Reminder email via Mandrill (MailChimp)
  email({ account, appointment, patient, sentReview }) {
    const reviewsUrl = `${account.website}?cc=review`;
    const stars = [];
    for (let i = 1; i < 6; i++) {
      stars.push({
        name: `STARS_URL_${i}`,
        content: `${reviewsUrl}&stars=${i}`,
      });
    }

    return sendReview({
      toEmail: patient.email,
      fromName: account.name,
      mergeVars: [
        {
          name: 'REVIEW_URL',
          // TODO: we might have to make this a token if UUID is too easy to guess...
          content: `${protocol}://${host}/sentReminders/${sentReview.id}/confirm`,
        },
        {
          name: 'ACCOUNT_PRIMARY_COLOR',
          content: account.bookingWidgetPrimaryColor,
        },
        {
          name: 'ACCOUNT_LOGO_URL',
          content: account.fullLogoUrl,
        },
        {
          name: 'ACCOUNT_NAME',
          content: account.name,
        },
        {
          name: 'ACCOUNT_CONTACT_EMAIL',
          content: account.contactEmail,
        },
        {
          name: 'ACCOUNT_CONTACT_NUMBER',
          content: account.phoneNumber,
        },
        {
          name: 'ACCOUNT_WEBSITE',
          content: account.website,
        },
        {
          name: 'ACCOUNT_CITY',
          content: `${account.city}, ${account.state}`,
        },
        {
          name: 'ACCOUNT_ADDRESS',
          content: account.street,
        },
        {
          name: 'PATIENT_FIRSTNAME',
          content: patient.firstName,
        },
      ].concat(stars),
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


