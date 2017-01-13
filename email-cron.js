const each = require('lodash/each');
const cron = require('node-cron');
const mail = require('./server/lib/mail');
const Appointment = require('./server/models/Appointment');
const Patient = require('./server/models/Patient');
const Service = require('./server/models/Service');
const Practitioner = require('./server/models/Practitioner');
const Account = require('./server/models/Account');

Appointment.belongsTo(Patient, 'patient', 'patientId', 'id');
Appointment.belongsTo(Service, 'service', 'serviceId', 'id');
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Appointment.belongsTo(Account, 'account', 'accountId', 'id');


// test pattern '*/2 * * * * *'
cron.schedule('*/2 * * * * *', () => {
  const mili24hours = 86400000;
  Appointment.getJoin().run()
    .then((appointments) => {
      const shouldNotifyAppointments = appointments.filter((appointment) => {
        const now = Date.now();
        const start = appointment.startTime.getTime();
        return (((start - now) <= mili24hours) && appointment.confirmed === false);
      });
      each(shouldNotifyAppointments, (a) => {
        mail.sendConfirmationReminder({
          toEmail: a.patient.email,
        }).then(() => {
          console.log('Email Sent');
          process.exit();
        }).catch((err) => {
          console.error(err);
          process.exit(1);
        });
      });
    })
    .catch(err => console.log(err));
});
