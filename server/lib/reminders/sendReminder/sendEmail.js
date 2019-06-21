
import { dateFormatter, formatPhoneNumber } from '@carecru/isomorphic';
import renderFamilyRemindersHTML from '../../emailTemplates/familyReminders';
import { buildAppointmentEvent } from '../../ics';
import { sendTemplate } from '../../mail';
import { getReminderTemplateName } from '../createReminderText';
import { NUM_DAYS_DEFAULT } from '../../../config/globals';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';
import isFeatureFlagEnabled from '../../featureFlag';

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
export default async function sendEmail({
  account,
  appointment,
  patient,
  sentReminder,
  reminder,
  dependants,
}) {
  const { isConfirmable } = sentReminder;

  const html =
    dependants &&
    dependants.length > 0 &&
    (await renderFamilyRemindersHTML({
      account,
      patient,
      appointment,
      sentReminder,
      familyMembers: dependants,
      isConfirmable,
    }));

  const accountLogoUrl =
    typeof account.fullLogoUrl === 'string' &&
    account.fullLogoUrl.replace('[size]', 'original');

  const appointmentMergeVars = appointment
    ? [
      {
        name: 'APPOINTMENT_DATE',
        content: dateFormatter(
          appointment.startDate,
          account.timezone,
          'dddd, MMMM Do YYYY',
        ),
      },
      {
        name: 'APPOINTMENT_TIME',
        content: dateFormatter(
          appointment.startDate,
          account.timezone,
          'h:mm a',
        ),
      },
    ]
    : [];

  const attachmentsObj = appointment
    ? {
      attachments: [
        {
          type: 'application/octet-stream',
          name: 'appointment.ics',
          content: Buffer.from(
            buildAppointmentEvent({
              appointment,
              patient,
              account,
            }),
          ).toString('base64'),
        },
      ],
    }
    : {};

  const reminderEmailFooter = await getMessageFromTemplates(
    account.id,
    'reminder-email-final-message',
    {
      numDays: NUM_DAYS_DEFAULT,
      phoneNumber: formatPhoneNumber(account.phoneNumber),
    },
  );

  const version = await isFeatureFlagEnabled(
    'reminder-email-template-version',
    null,
    {
      userId: 'carecru-api',
      accountId: account.id,
      enterpriseId: account.enterpriseId,
    },
  );

  const templateName = html
    ? 'test-html-template'
    : getReminderTemplateName({
      isConfirmable,
      reminder,
      account,
      version,
    });

  return sendTemplate({
    patientId: patient.id,
    toEmail: patient.email,
    fromName: account.name,
    replyTo: account.contactEmail,
    subject: html ? 'Family Reminder' : 'Appointment Reminder',
    templateName,
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
        content: `${process.env.API_SERVER_URL}/my/sentReminders/${
          sentReminder.id
        }/confirm`,
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
        content: `https://search.google.com/local/writereview?placeid=${
          account.googlePlaceId
        }`,
      },
      {
        name: 'REMINDER_EMAIL_FOOTER',
        content: reminderEmailFooter || '',
      },
      ...appointmentMergeVars,
    ],
    ...attachmentsObj,
  });
}
