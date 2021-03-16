

const { sendTemplate } = require('../server/lib/mail');
const { formatPhoneNumber } = require('../client/util/isomorphic');

const mergeVars = [
  {
    name: 'PRIMARY_COLOR',
    content: '#eeaf16',
  },
  {
    name: 'ACCOUNT_CLINICNAME',
    content: 'Beckett Dental',
  },
  {
    name: 'ACCOUNT_LOGO_URL',
    content: 'https://carecru-production.s3.amazonaws.com/logos/eed25a35-56e4-494f-8822-bcef14cf418f/49d1f5bc-04fb-44e3-810f-367a40712a7e_original_BeckettLogo_square.png',
  },
  {
    name: 'ACCOUNT_PHONENUMBER',
    content: formatPhoneNumber('+16049809999'),
  },
  {
    name: 'ACCOUNT_TWILIONUMBER',
    content: formatPhoneNumber('+1555555555'),
  },
  {
    name: 'ACCOUNT_CITY',
    content: 'North Vancouver',
  },
  {
    name: 'ACCOUNT_CONTACTEMAIL',
    content: 'info@beckettdental.com',
  },
  {
    name: 'ACCOUNT_ADDRESS',
    content: '#101 - 1312 Marine Drive',
  },
  {
    name: 'PATIENT_FIRSTNAME',
    content: 'Justin',
  },
  {
    name: 'RECALL_DUEDATE',
    content: 'November 30th, 2017',
  },
  {
    name: 'ACCOUNT_WEBSITE',
    content: 'http://www.beckettdental.com',
  },
  {
    name: 'BOOK_URL',
    content: 'http://www.capitolhilldental.ca/?cc=book',
  },
  {
    name: 'CONFIRMATION_URL',
    content: 'http://www.google.com',
  },
  {
    name: 'FACEBOOK_URL',
    content: 'http://www.facebook.com',
  },
  {
    name: 'GOOGLE_URL',
    content: 'http://www.google.com',
  },
  {
    name: 'REMINDER_EMAIL_FOOTER',
    content: 'If you need to reschedule your appointment, please call 780-850-8886. ' +
    'Note, there may be a fee for cancellations or reschedules within ' +
    '2 business days of an appointment.',
  },
];

async function main() {
  try {
    const templateName = 'Reminder - Same Day - Confirmed - 1.1.0';
    await sendTemplate({
      mergeVars,
      toEmail: 'justin@carecru.com',
      subject: 'Appointment Reminder',
      templateName,
    });

    console.log('Email Sent', templateName);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}


main();
