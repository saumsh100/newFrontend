const Queue = require('rethinkdb-job-queue');
const mail = require('../lib/mail');
const db = require('../config/globals').db;
const twilio = require('../config/globals').twilio;
const twilioClient = require('../config/twilio');

const NODE_ENV = process.env.NODE_ENV || 'development';
const protocol = NODE_ENV === 'production' ? 'https' : 'http';
const host = NODE_ENV === 'production' ? 'carecru.com' : 'localhost:5000';


const options = {
  db: db.db,
  name: 'appoinment-reminders',
};

const smsConfirmationQueue = new Queue(options);
const emailConfirmationQueue = new Queue(options);

smsConfirmationQueue.process((job, next) => {
  return twilioClient.sendMessage({
    from: twilio.number,
    to: job.a.patient.phoneNumber,
    body: `Your ${job.a.service.name} appointment with ${job.a.practitioner.firstName} ${job.a.practitioner.lastName} from ${job.a.account.name} is less than 24 hours away. Press 'C' to confirm that you can make it.`,
  })
  .then((result) => {
    console.log(result);
    return next(null, result);
  })
  .catch((err) => {
    console.error(err);
    return next(err);
  });
});

emailConfirmationQueue.process((job, next) => {
  return mail.sendConfirmationReminder({
    toEmail: job.params.email,
    mergeVars: [
      {
        name: 'CONFIRMATION_URL',
        content: `${protocol}://${host}/confirmation/${job.params.token}`,
      },
      {
        name: 'ACCOUNT_NAME',
        content: job.params.accountName,
      },
      {
        name: 'ACCOUNT_PHONENUMBER',
        content: job.params.smsPhoneNumber,
      },
      {
        name: 'APPOINTMENT_DATE',
        content: getAppointmentDate(job.params.date),
      },
      {
        name: 'APPOINTMENT_TIME',
        content: getAppointmentTime(job.params.date),
      },
      {
        name: 'PATIENT_FIRSTNAME',
        content: job.params.patientFirstname,
      },
    ],
  }).then((info) => {
    console.log(info);
    return next(null, info);
  }).catch((err) => {
    console.error(err);
    return next(err);
  });
});

function emailConfirmation(params) {
  const job = smsConfirmationQueue.createJob();
  job.params = params;
  smsConfirmationQueue.addJob(job).then((savedJob) => {
    console.log(`Job Added: ${savedJob[0]}`);
  }).catch(err => console.error(err));
}


function smsConfirmation(a) {
  const job = smsConfirmationQueue.createJob();
  job.a = a;
  smsConfirmationQueue.addJob(job).then((savedJob) => {
    console.log(`Job Added: ${savedJob[0]}`);
  }).catch(err => console.error(err));
}

function getAppointmentDate(date) {
  return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
}

function getAppointmentTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}


exports.emailConfirmation = emailConfirmation;
exports.smsConfirmation = smsConfirmation;
