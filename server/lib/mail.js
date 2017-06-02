
const mandrill = require('../config/mandrill');

module.exports = {
  sendConfirmationReminder: (config) => {
    config.subject = 'Appointment Confirmation';
    config.templateName = 'Appointment Confirmation';
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
  const {
    from = 'noreply@carecru.com',
    subject,
    toEmail,
    templateName,
    mergeVars,
    fromName,
    attachments,
  } = config;

  return new Promise((resolve, reject) => {
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

          global_merge_vars: mergeVars,
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
