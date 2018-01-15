
import moment from 'moment';
import mandrill from '../config/mandrill';
import { host, protocol, env } from '../config/globals';

export const sendConnectorDown = (config) => {
  config.subject = `The Connector for ${config.name} is Down!`;
  config.templateName = 'Connector Down';
  return exports.sendTemplate(config);
};

export const sendConfirmationReminder = (config) => {
  config.subject = 'Appointment Reminder';
  config.templateName = 'Patient Reminder - 2 Hours Before UnConfirmed'; // Test Template, needs to be updated
  return exports.sendTemplate(config);
};

export const sendDueForRecare = (config) => {   // This function is used only for testing
  config.subject = 'Appointment Reminder';
  config.templateName = 'Patient Password Reset';
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
  config.templateName = 'Appointment Request - Clinic';
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
  config.templateName = 'Patient Review';
  return exports.sendTemplate(config);
};

/**
 * sendTemplate is used as a normilzation and promise wrapper for sending emails
 *
 * @param config
 * @returns {Promise}
 */
export function sendTemplate(config) {
  const accountString = config.accountId ? `:${config.accountId}` : '';
  const string = config.email + accountString;
  const encoded = config.patientId ? new Buffer(config.patientId).toString('base64') : new Buffer(string).toString('base64');
  const hostUrl = config.accountId ? `my.${host}` : host;
  const unsubContent = `${protocol}://${hostUrl}/unsubscribe/${encoded}`;
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
    fromName = 'CareCru',
    attachments,
  } = config;

  return new Promise((resolve, reject) => {
    // Do not send emails in test mode
    if (env === 'test') {
      console.log(`TEST: Successfully sent the ${templateName} email to ${toEmail}`);
      return resolve({});
    }

    mandrill.messages.sendTemplate({
        template_name: templateName,

        // TODO: why is this needed?
        template_content: [{
          name: 'example name',
          content: 'example content',
        }],

        // Message Data
        message: {
          from: from,
          subject: subject,
          from_email: from,
          from_name: fromName,
          to: [{
            email: toEmail,
            type: 'to',
          }],

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
          console.error(`Mandrill Error: ${err}`) ;
          reject(err);
        }
      });
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
    mandrill.templates.render({
        template_name: templateName,
        template_content: [{
          name: 'example name',
          content: 'example content',
        }],

        merge_vars: mergeVars,
      },

      ({ html }) => {
        resolve(html);
      },

      (err) => {
        reject(err);
      });
  });
}

export function generateClinicMergeVars({ patient, account }) {
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
      content: account.phoneNumber,
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
      content: 'https://carecru-staging.s3.amazonaws.com/dev/dental_clinic_logo_red.png',
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
