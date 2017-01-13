
const mail = require('./server/lib/mail');

mail.sendConfirmationReminder({
  toEmail: 'justin@carecru.com',
}).then(() => {
  console.log('Email Sent');
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
