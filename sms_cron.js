const each = require('lodash/each');
const cron = require('node-cron');
const Appointment = require('./server/models/Appointment');
const Patient = require('./server/models/Patient');
const Service = require('./server/models/Service');
const Practitioner = require('./server/models/Practitioner');
const Account = require('./server/models/Account');
const twilio = require('./server/config/globals').twilio;
const twilioClient = require('./server/config/twilio');

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
        twilioClient.sendMessage({
          from: twilio.number,
          to: a.patient.phoneNumber,
          body: `Your ${a.service.name} appointment with
            ${a.practitioner.firstName} ${a.practitioner.lastName}
            from ${a.account.name}
            is less than 24 hours away. Press 'C' to confirm that you can make it.`,
        })
        .then(result => console.log(result));
      });
    })
    .catch(err => console.log(err));
});
