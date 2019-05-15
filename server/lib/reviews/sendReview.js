
import moment from 'moment-timezone';
import compressUrl from '../../util/compressUrl';
import { sendReview } from '../mail';
import { createReviewText } from './createReviewText';
import { formatPhoneNumber } from '../../util/formatters';
import { host } from '../../config/globals';
import { sendMessage } from '../../services/chat';
import isFeatureFlagEnabled from '../featureFlag';
import { getMessageFromTemplates } from '../../services/communicationTemplate';

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
    const body = await createReviewText({
      patient,
      account,
      link,
    });
    return sendMessage(patient.cellPhoneNumber, body, account.id);
  },

  // Send Review email via Mandrill (MailChimp)
  async email({ account, patient, sentReview }) {
    const accountId = account.id;
    const templateName = await isFeatureFlagEnabled(
      'review-request-email-template-name',
      'Patient Review',
      {
        accountId,
        enterpriseId: account.enterpriseId,
        host,
        userId: 'carecru-api',
      },
    );

    const parameters = {};
    const [
      reviewsEmailCta,
      starSubtext1,
      starSubtext3,
      starSubtext5,
    ] = await Promise.all([
      getMessageFromTemplates(accountId, 'reviews-email-cta', parameters),
      getMessageFromTemplates(accountId, 'reviews-email-1-star-subtext', parameters),
      getMessageFromTemplates(accountId, 'reviews-email-3-star-subtext', parameters),
      getMessageFromTemplates(accountId, 'reviews-email-5-star-subtext', parameters),
    ]);

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
      templateName,
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
        {
          name: 'REVIEW_REQUEST_CTA',
          content: reviewsEmailCta,
        },
        {
          name: 'STAR_SUBTEXT_1',
          content: starSubtext1,
        },
        {
          name: 'STAR_SUBTEXT_3',
          content: starSubtext3,
        },
        {
          name: 'STAR_SUBTEXT_5',
          content: starSubtext5,
        },
      ].concat(stars),
    });
  },
};
