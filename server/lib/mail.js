
import moment from 'moment';
import mandrill from '../config/mandrill';
import { host, myHost, protocol, env } from '../config/globals';
import { formatPhoneNumber } from '../util/formatters';

export const sendConnectorDown = (config) => {
  config.subject = `${config.name} down - ${config.adapterType}`;
  config.templateName = 'Connector Down';
  return exports.sendTemplate(config);
};

export const sendConnectorBackUp = (config) => {
  config.subject = `The Connector is up for ${config.name}!`;
  config.templateName = 'Connector Back Up';
  return sendTemplate(config);
};

export const sendConfirmationReminder = (config) => {
  config.subject = 'Appointment Reminder';
  config.templateName = 'Patient Reminder - 2 Hours Before UnConfirmed'; // Test Template, needs to be updated
  return exports.sendTemplate(config);
};

export const sendTestEmailTemplate = (config) => {
  // This function is used only for testing
  config.subject = 'Family Reminder';
  config.templateName = 'test-html-template';
  return exports.sendTemplate(config);
};

export const sendAlreadyConfirmedReminder = (config) => {
  config.subject = 'Appointment Reminder';
  config.templateName = 'Patient Reminder - 2 Hours Before Confirmed'; // Test Template, needs to be updated
  return sendTemplate(config);
};

export const sendPatientRecall = (config) => {
  config.subject = 'You are due for your next appointment';
  config.templateName = 'Patient Recall - 64 Week After'; // Test Template, needs to be updated
  return exports.sendTemplate(config);
};

export const sendPatientSignup = (config) => {
  config.subject = 'Confirm your email';
  config.templateName = 'Patient Email Confirmation';
  return exports.sendTemplate(config);
};

export const sendAppointmentRequested = (config) => {
  config.subject = 'Congratulations! Your appointment was requested.';
  config.templateName = 'Patient Appointment - Requested';
  return exports.sendTemplate(config);
};

export const sendAppointmentRequestedClinic = (config) => {
  config.subject = 'An appointment was requested.';
  config.templateName = 'User Appointment Requested';
  return exports.sendTemplate(config);
};

export const sendAppointmentRequestRejected = (config) => {
  config.subject = 'Sorry, Your appointment was Rejected.';
  config.templateName = 'Patient Appointment - Cancelled';
  return exports.sendTemplate(config);
};

export const sendAppointmentRequestConfirmed = (config) => {
  config.subject = 'Congratulations! Your appointment request was confirmed.';
  config.templateName = 'Patient Appointment - Confirmed';
  return exports.sendTemplate(config);
};

export const sendInvite = (config) => {
  config.subject = 'Join CareCru';
  config.templateName = 'Join CareCru';
  return exports.sendTemplate(config);
};

export const sendResetPassword = (config) => {
  config.subject = 'Reset Password';
  config.templateName = 'User Password Reset';
  return exports.sendTemplate(config);
};

export const sendPatientResetPassword = (config) => {
  config.subject = 'Reset Password';
  config.templateName = 'Patient Password Reset';
  return exports.sendTemplate(config);
};

export const sendReview = (config) => {
  config.subject = 'Tell us about your experience.';
  return exports.sendTemplate(config);
};

export const sendFamilyReminder = (config) => {
  config.subject = 'Tell us about your experience.';
  config.templateName = 'Patient Review';
  return exports.sendTemplate(config);
};

export const sendMassOnlineBookingIntro = (config) => {
  config.subject = 'Online Booking Now Available';
  config.templateName = 'Online Booking Introduction';
  return exports.sendTemplate(config);
};

export const sendMassGeneralIntroAnnouncement = config =>
  exports.sendTemplate({
    ...config,
    subject: 'Introducing Online Scheduling',
    templateName: 'General Introduction Announcement',
  });

/**
 * sendTemplate is used as a normilzation and promise wrapper for sending emails
 *
 * @param config
 * @returns {Promise}
 */
export function sendTemplate(config) {
  const accountString = config.accountId ? `:${config.accountId}` : '';
  const string = config.email + accountString;
  const encoded = config.patientId
    ? new Buffer(config.patientId).toString('base64')
    : new Buffer(string).toString('base64');
  const unsubContent = `${process.env.API_SERVER_URL}/my/unsubscribe/${encoded}`;
  const defaultMergeVars = [
    {
      name: 'UNSUB',
      content: unsubContent,
    },
    {
      name: 'ACCOUNT_NAME',
      content: config.fromName,
    },
  ];

  const {
    from = 'noreply@carecru.com',
    subject,
    toEmail,
    templateName,
    mergeVars,
    replyTo,
    fromName = 'CareCru',
    attachments,
    html,
  } = config;

  return new Promise((resolve, reject) => {
    // Do not send emails in test mode
    if (env === 'test') {
      console.log(`TEST: Successfully sent the ${templateName} email to ${toEmail}`);
      return resolve({});
    }

    const htmlObj = html ? { html } : {};

    mandrill.messages.sendTemplate(
      {
        template_name: templateName,

        // TODO: why is this needed?
        template_content: [
          {
            name: 'example name',
            content: 'example content',
          },
        ],

        // Message Data
        message: {
          ...htmlObj,
          from,
          subject,
          from_email: from,
          from_name: fromName,
          to: [
            {
              email: toEmail,
              type: 'to',
            },
          ],

          headers: { 'Reply-To': replyTo },

          global_merge_vars: mergeVars.concat(defaultMergeVars),
          attachments,
        },
      },

      // Success Callback
      (result) => {
        resolve(result);
      },

      // Error Callback
      (err) => {
        if (err) {
          console.error(`Mandrill Error: ${JSON.stringify(err, null, 2)}`);
          reject(err);
        }
      },
    );
  });
}

/**
 *
 * @param config
 * @returns {Promise}
 */
export function renderTemplate(config) {
  const { mergeVars = [], templateName } = config;
  return new Promise((resolve, reject) => {
    mandrill.templates.render(
      {
        template_name: templateName,
        template_content: [
          {
            name: 'example name',
            content: 'example content',
          },
        ],

        merge_vars: mergeVars,
      },

      ({ html }) => {
        resolve(html);
      },

      (err) => {
        reject(err);
      },
    );
  });
}

export function generateClinicMergeVars({ patient, account }) {
  const accountLogoUrl =
    typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');
  return [
    // Patient Variables
    {
      name: 'PATIENT_FIRSTNAME',
      content: patient.firstName,
    },
    {
      name: 'PATIENT_LASTAPPOINTMENTDATE',
      content: moment(patient.lastApptDate).format('dddd, MMMM Do'),
    },
    {
      name: 'RECALL_DUEDATE',
      content: moment(patient.dueDate).format('dddd, MMMM Do'),
    },

    // Clinic Variables
    {
      name: 'ACCOUNT_CLINICNAME',
      content: account.name,
    },
    {
      name: 'ACCOUNT_PHONENUMBER',
      content: formatPhoneNumber(account.phoneNumber),
    },
    {
      name: 'ACCOUNT_TWILIONUMBER',
      content: account.twilioPhoneNumber,
    },
    {
      name: 'ACCOUNT_TWILIONUMBER_FORMATTED',
      content: formatPhoneNumber(account.twilioPhoneNumber),
    },
    {
      name: 'ACCOUNT_CONTACTEMAIL',
      content: account.contactEmail,
    },
    {
      name: 'ACCOUNT_STREET',
      content: account.address.street,
    },
    {
      name: 'ACCOUNT_CITY',
      content: `${account.address.city}, ${account.address.state}`,
    },
    {
      name: 'PRIMARY_COLOR',
      content: account.bookingWidgetPrimaryColor,
    },
    {
      name: 'ACCOUNT_LOGO_URL',
      content: accountLogoUrl,
    },
    {
      name: 'ACCOUNT_ADDRESS',
      content: account.address.street,
    },
    {
      name: 'FACEBOOK_URL',
      content: account.facebookUrl,
    },
    {
      name: 'GOOGLE_URL',
      content: `https://search.google.com/local/writereview?placeid=${account.googlePlaceId}`,
    },
  ];
}
