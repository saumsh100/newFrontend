
import mandrill from '../config/mandrill';
import { host, protocol, env } from '../config/globals';

module.exports = {
  sendConfirmationReminder: (config) => {
    config.subject = 'Appointment Reminder';
    config.templateName = 'Appointment Reminder';
    return sendTemplate(config);
  },

  sendPatientRecall: (config) => {
    config.subject = 'You are due for your next appointment';
    config.templateName = 'Patient Recall';
    return sendTemplate(config);
  },

  sendPatientSignup: (config) => {
    config.subject = 'Confirm your email';
    config.templateName = 'Patient Signup Confirmation';
    return sendTemplate(config);
  },

  sendAppointmentRequested: (config) => {
    config.subject = 'Congratulations! Your appointment was requested.';
    config.templateName = 'Appointment Requested';
    return sendTemplate(config);
  },

  sendAppointmentRequestRejected: (config) => {
    config.subject = 'Sorry, Your appointment was Rejected.';
    config.templateName = 'Appointment Rejected';
    return sendTemplate(config);
  },

  sendAppointmentRequestConfirmed: (config) => {
    config.subject = 'Congratulations! Your appointment request was confirmed.';
    config.templateName = 'Appointment Request Confirmed';
    return sendTemplate(config);
  },

  sendInvite: (config) => {
    config.subject = 'Join CareCru';
    config.templateName = 'Join CareCru';
    return sendTemplate(config);
  },

  sendResetPassword: (config) => {
    config.subject = 'Reset Password';
    config.templateName = 'Reset Password';
    return sendTemplate(config);
  },

  sendPatientResetPassword: (config) => {
    config.subject = 'Reset Password';
    config.templateName = 'Patient Reset Password';
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
  const encoded = new Buffer(string).toString('base64');
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
