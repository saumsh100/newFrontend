
import mandrill from '../config/mandrill';
import { host, protocol, env } from '../config/globals';

module.exports = {
  sendConnectorDown: (config) => {
    config.subject = `The Connector for ${config.name} is Down!`;
    config.templateName = 'Connector Down';
    return sendTemplate(config);
  },

  sendConnectorBackUp: (config) => {
    config.subject = `The Connector for ${config.name} is Back Up!`;
    config.templateName = 'Connector Back Up';
    return sendTemplate(config);
  },

  sendConfirmationReminder: (config) => {
    config.subject = 'Appointment Reminder';
    config.templateName = 'Patient Reminder - 2 Hours Before UnConfirmed'; // Test Template, needs to be updated
    return sendTemplate(config);
  },

  sendDueForRecare: (config) => {   // This function is used only for testing
    config.subject = 'Appointment Reminder';
    config.templateName = 'Patient Password Reset';
    return sendTemplate(config);
  },

  sendAlreadyConfirmedReminder: () => {
    config.subject = 'Appointment Reminder';
    config.templateName = 'Patient Reminder - 2 Hours Before Confirmed'; // Test Template, needs to be updated
    return sendTemplate(config);
  },

  sendPatientRecall: (config) => {
    config.subject = 'You are due for your next appointment';
    config.templateName = 'Patient Recall - 64 Week After'; // Test Template, needs to be updated
    return sendTemplate(config);
  },

  sendPatientSignup: (config) => {
    config.subject = 'Confirm your email';
    config.templateName = 'Patient Email Confirmation';
    return sendTemplate(config);
  },

  sendAppointmentRequested: (config) => {
    config.subject = 'Congratulations! Your appointment was requested.';
    config.templateName = 'Patient Appointment - Requested';
    return sendTemplate(config);
  },

  sendAppointmentRequestedClinic: (config) => {
    config.subject = 'An appointment was requested.';
    config.templateName = 'Appointment Request - Clinic';
    return sendTemplate(config);
  },

  sendAppointmentRequestRejected: (config) => {
    config.subject = 'Sorry, Your appointment was Rejected.';
    config.templateName = 'Patient Appointment - Cancelled';
    return sendTemplate(config);
  },

  sendAppointmentRequestConfirmed: (config) => {
    config.subject = 'Congratulations! Your appointment request was confirmed.';
    config.templateName = 'Patient Appointment - Confirmed';
    return sendTemplate(config);
  },

  sendInvite: (config) => {
    config.subject = 'Join CareCru';
    config.templateName = 'Join CareCru';
    return sendTemplate(config);
  },

  sendResetPassword: (config) => {
    config.subject = 'Reset Password';
    config.templateName = 'User Password Reset';
    return sendTemplate(config);
  },

  sendPatientResetPassword: (config) => {
    config.subject = 'Reset Password';
    config.templateName = 'Patient Password Reset';
    return sendTemplate(config);
  },

  sendReview: (config) => {
    config.subject = 'Tell us about your experience.';
    config.templateName = 'Patient Review';
    return sendTemplate(config);
  },
};

/**
 * sendTemplate is used as a normilzation and promise wrapper for sending emails
 *
 * @param config
 * @returns {Promise}
 */
function sendTemplate(config) {
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
        console.log(`Successfully sent the ${templateName} email to ${toEmail}`);
        resolve(result);
      },

      // Error Callback
      (err) => {
        if (err) {
          console.log(`Mandrill Error: ${err}`);
          reject(err);
        }
      });
  });
}
