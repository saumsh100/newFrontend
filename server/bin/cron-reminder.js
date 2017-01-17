const each = require('lodash/each');
const cron = require('node-cron');
const mail = require('../lib/mail');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Service = require('../models/Service');
const Practitioner = require('../models/Practitioner');
const Account = require('../models/Account');
const Token = require('../models/Token');
const twilio = require('../config/globals').twilio;
const twilioClient = require('../config/twilio');

Appointment.belongsTo(Patient, 'patient', 'patientId', 'id');
Appointment.belongsTo(Service, 'service', 'serviceId', 'id');
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Appointment.belongsTo(Account, 'account', 'accountId', 'id');
Token.hasOne(Appointment, 'appointment', 'appointmentId', 'id');

const NODE_ENV = process.env.NODE_ENV || 'development';
const protocol = NODE_ENV === 'production' ? 'https' : 'http';
const host = NODE_ENV === 'production' ? 'carecru.com' : 'localhost:5000';

// test pattern '*/2 * * * * *'
cron.schedule('*/10 * * * * *', () => {
  const mili24hours = 86400000;
  Appointment.getJoin().run()
    .then((appointments) => {
      const shouldNotifyAppointments = appointments.filter((appointment) => {
        const now = Date.now();
        const start = appointment.startTime.getTime();
        return (((start - now) <= mili24hours) && appointment.confirmed === false);
      });
      each(shouldNotifyAppointments, (a) => {
        Token.filter({ appointmentId: a.id }).run()
        .then((token) => {
          const emailConfObject = {
            email: a.patient.email,
            token: token[0].id,
            accountName: a.account.name,
            smsPhoneNumber: a.account.smsPhoneNumber,
            date: a.startTime,
            patientFirstname: a.patient.firstName };
          if (a.patient.appointmentPreference === 'both') {
            emailConfirmation(emailConfObject);
            smsConfirmation(a);
          }
          if (a.patient.appointmentPreference === 'email') {
            emailConfirmation(emailConfObject);
          }
          if (a.patient.appointmentPreference === 'sms') {
            smsConfirmation(a);
          }
        });
      });
    })
    .catch(err => console.log(err));
});


function emailConfirmation(params) {
  mail.sendConfirmationReminder({
    toEmail: params.email,
    mergeVars: [
      {
        name: 'CONFIRMATION_URL',
        content: `${protocol}://${host}/confirmation/${params.token}`,
      },
      {
        name: 'ACCOUNT_NAME',
        content: params.accountName,
      },
      {
        name: 'ACCOUNT_PHONENUMBER',
        content: params.smsPhoneNumber,
      },
      {
        name: 'APPOINTMENT_DATE',
        content: getAppointmentDate(params.date),
      },
      {
        name: 'APPOINTMENT_TIME',
        content: getAppointmentTime(params.date),
      },
      {
        name: 'PATIENT_FIRSTNAME',
        content: params.patientFirstname,
      },
    ],
  }).then(() => {
    console.log('Email Sent');
  }).catch((err) => {
    console.error(err);
  });
}


function smsConfirmation(a) {
  twilioClient.sendMessage({
    from: twilio.number,
    to: a.patient.phoneNumber,
    body: `Your ${a.service.name} appointment with ${a.practitioner.firstName} ${a.practitioner.lastName} from ${a.account.name} is less than 24 hours away. Press 'C' to confirm that you can make it.`,
  })
  .then(result => console.log(result));
}

function getAppointmentDate(date) {
  return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
}

function getAppointmentTime(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}
