
const mail = require('../server/lib/mail');

const protocol = 'https';
const host = 'localhost:5000';
const token = 'token-test';

mail.sendConfirmationReminder({
  toEmail: 'justin@carecru.com',
  mergeVars: [
    {
      name: 'CONFIRMATION_URL',
      content: `${protocol}://${host}/confirmation/${token}`,
    },
  ]
}).then(() => {
  console.log('Email Sent');
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
