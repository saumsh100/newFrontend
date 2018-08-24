
import moment from 'moment';
import { sendTemplate } from '../mail';
import createRecallText from './createRecallText';
import compressUrl from '../../util/compressUrl';
import { formatPhoneNumber } from '../../util/formatters';
import { sendMessage } from '../../services/chat';

const recallIntervalToTemplate = {
  '1 weeks': 'Patient Recall - 1 Weeks Before',
  '1 months': 'Patient Recall - 1 Months Before',
  '-1 weeks': 'Patient Recall - 1 Weeks After',
  '-1 months': 'Patient Recall - 1 Months After',
  '-2 months': 'Patient Recall - 2 Months After',
  '-4 months': 'Patient Recall - 4 Months After',
  '-6 months': 'Patient Recall - 6 Months After',
  '-8 months': 'Patient Recall - 8 Months After',
  '-10 months': 'Patient Recall - 10 Months After',
  '-12 months': 'Patient Recall - 12 Months After',
  '-14 months': 'Patient Recall - 14 Months After',
  '-16 months': 'Patient Recall - 16 Months After',
  '-18 months': 'Patient Recall - 18 Months After',
};

const generateBookingUrl = ({ account, sentRecall, dueDate }) => `${account.website}?cc=book&sentRecallId=${encodeURIComponent(sentRecall.id)}&dueDate=${encodeURIComponent(dueDate)}`;

export default {
  // Send Appointment Reminder text via Twilio
  async sms({ account, patient, sentRecall, recall, dueDate }) {
    const longLink = generateBookingUrl({
      account,
      sentRecall,
      dueDate: dueDate.slice(0),
    });
    const shortLink = await compressUrl(longLink);
    const link = `https://${shortLink}`;
    const lastDate = patient.hygiene ? patient.lastHygieneDate : patient.lastRecallDate;
    const body = createRecallText({
      patient,
      account,
      sentRecall,
      recall,
      link,
      dueDate,
      lastApptDate: lastDate,
    });
    return sendMessage(patient.mobilePhoneNumber, body);
  },

  // Send Appointment Reminder email via Mandrill (MailChimp)
  email({ account, dueDate, recall, patient, sentRecall }) {
    if (!patient.email) {
      throw new Error(`patient with id=${patient.id} does not have an email`);
    }

    const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
    const lastDate = patient.hygiene ? patient.lastHygieneDate : patient.lastRecallDate;

    return sendTemplate({
      patientId: patient.id,
      toEmail: patient.email,
      fromName: account.name,
      subject: 'You are due for your next appointment',
      templateName: recallIntervalToTemplate[recall.interval],
      mergeVars: [
        {
          name: 'PRIMARY_COLOR',
          content: account.bookingWidgetPrimaryColor || '#206477',
        },
        {
          name: 'BOOK_URL',
          content: generateBookingUrl({
            account,
            sentRecall,
            dueDate,
          }),
        },
        {
          name: 'ACCOUNT_CLINICNAME',
          content: account.name,
        },
        {
          name: 'ACCOUNT_ADDRESS',
          content: account.address.street,
        },
        {
          name: 'ACCOUNT_CITY',
          content: account.address.city,
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
          name: 'WEEKSBEFORE_DUEDATE',
          content: moment(dueDate).diff(moment(), 'weeks'),
        },
        {
          name: 'MONTHS_LASTAPPT',
          content: moment().diff(moment(lastDate), 'months'),
        },
        {
          name: 'MONTHS_PASTDUE',
          content: moment().diff(moment(dueDate), 'months'),
        },
        {
          name: 'WEEKSAFTER_DUEDATE',
          content: moment().diff(moment(lastDate), 'weeks'),
        },
        {
          name: 'ACCOUNT_LOGO_URL',
          content: accountLogoUrl,
        },
        {
          name: 'RECALL_DUEDATE',
          content: moment(dueDate).format('LL'),
        },
        {
          name: 'FACEBOOK_URL',
          content: account.facebookUrl,
        },
        {
          name: 'GOOGLE_URL',
          content: `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}`,
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

