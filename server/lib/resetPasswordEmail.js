
const mandrill = require('../config/mandrill');

module.exports = {
  resetPasswordEmail: (config) => {
    config.subject = 'Reset User Password - CareCru';
    config.templateName = 'Reset Password';
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
          from_name: 'CareCru',
          to: [{
            email: toEmail,
            type: 'to',
          }],

          global_merge_vars: mergeVars,
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
