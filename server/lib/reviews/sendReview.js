
import moment from 'moment-timezone';
import compressUrl from '../../util/compressUrl';
import { sendReview } from '../mail';
import { createReviewText } from './createReviewText';
import { formatPhoneNumber } from '../../util/formatters';
import { sendMessage } from '../../services/chat';

const generateReviewsUrl = ({ account, sentReview }) =>
  `${account.website}?cc=review&srid=${sentReview.id}&accountId=${account.id}`;

export default {
  // Send Review SMS via Twilio
  async sms({ account, patient, sentReview }) {
    const longLink = generateReviewsUrl({
      account,
      sentReview,
    });
    const shortLink = await compressUrl(longLink);
    const link = `https://${shortLink}`;
    const body = createReviewText({
      patient,
      account,
      link,
    });
    return sendMessage(patient.mobilePhoneNumber, body);
  },

  // Send Review email via Mandrill (MailChimp)
  email({ account, patient, sentReview }) {
    const reviewsUrl = generateReviewsUrl({
      account,
      sentReview,
    });
    const stars = [];
    for (let i = 1; i < 6; i++) {
      stars.push({
        name: `STARS_URL_${i}`,
        content: `${reviewsUrl}&stars=${i}`,
      });
    }

    const accountLogoUrl = typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

    return sendReview({
      patientId: patient.id,
      toEmail: patient.email,
      fromName: account.name,
      replyTo: account.contactEmail,
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
          name: 'ACCOUNT_CLINICNAME',
          content: account.name,
        },
        {
          name: 'ACCOUNT_CONTACTEMAIL',
          content: account.contactEmail,
        },
        {
          name: 'ACCOUNT_PHONENUMBER',
          content: formatPhoneNumber(account.phoneNumber),
        },
        {
          name: 'ACCOUNT_WEBSITE',
          content: account.website,
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

