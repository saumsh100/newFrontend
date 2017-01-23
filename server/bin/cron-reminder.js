// import moment from 'moment';
const each = require('lodash/each');
const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Service = require('../models/Service');
const Practitioner = require('../models/Practitioner');
const Account = require('../models/Account');
const Token = require('../models/Token');
const emailConfirmation = require('./rethinkQueue').emailConfirmation;
const smsConfirmation = require('./rethinkQueue').smsConfirmation;

Appointment.belongsTo(Patient, 'patient', 'patientId', 'id');
Appointment.belongsTo(Service, 'service', 'serviceId', 'id');
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Appointment.belongsTo(Account, 'account', 'accountId', 'id');
Token.hasOne(Appointment, 'appointment', 'appointmentId', 'id');

// to run this file add line below to procfile
// cron-reminder: node ./server/bin/cron-reminder.js

const NODE_ENV = process.env.NODE_ENV || 'development';
const cronPattern = NODE_ENV === 'production' ? '0 */30  * * * *' : '*/20 * * * * *';
// test pattern '*/2 * * * * *'
cron.schedule(cronPattern, () => {
  const mili24hours = 86400000;
  Appointment.getJoin().run()
    .then((appointments) => {
      const shouldNotifyAppointments = appointments.filter((appointment) => {
        const now = Date.now();
        const start = appointment.startTime.getTime();
        return ((((start - now) <= mili24hours) && (start - now) > 0)
          && appointment.confirmed === false);
      });
      shouldNotifyAppointments.length && each(shouldNotifyAppointments, (a) => {
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
