
import twilio from '../../config/twilio';
import moment from 'moment';
import { host } from '../../config/globals';
import { sendPatientRecall } from '../mail';
import { buildAppointmentEvent } from '../ics';

const BASE_URL = `https://${host}/twilio/voice/reminders`;
const createReminderText = ({ patient, account, appointment }) => (`
  ${patient.firstName}, your next appointment with ${account.name}
  is ${appointment.startDate} at ${appointment.startTime}. Reply 'C' to
  confirm your appointment.
`);

const generateCallBackUrl = ({ account, appointment, patient }) => {
  const mDate = moment(appointment.startDate);
  const startDate = mDate.format('dddd, MMMM do'); // Saturday, July 9th
  const startTime = mDate.format('h:mma'); // 2:15pm
  return `${BASE_URL}
      ?firstName=${patient.firstName},
       clinicName=${account.name},
       startDate=${startDate},
       startTime=${startTime}`;
};

export default {
  // Send Appointment Reminder email via Mandrill (MailChimp)
  email({ account, lastAppointment, patient }) {
    if (!patient.email) {
      throw new Error(`patient with id=${patient.id} does not have an email`);
    }

    return sendPatientRecall({
      patientId: patient.id,
      toEmail: patient.email,
      fromName: account.name,
      mergeVars: [
        {
          name: 'BOOK_URL',
          content: `${account.website}?cc=book`,
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
          content: account.phoneNumber,
        },
        {
          name: 'PATIENT_LASTAPPOINTMENTDATE',
          content: getTimeAgo(lastAppointment.startDate),
        },
        {
          name: 'PATIENT_FIRSTNAME',
          content: patient.firstName,
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

function getTimeAgo(date) {
  return moment(date).from();
}

function getAppointmentTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}


