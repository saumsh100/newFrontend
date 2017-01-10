const each = require('lodash/each');
const cron = require('node-cron');
const Appointment = require('./server/models/Appointment');
const Patient = require('./server/models/Patient');
const twilio = require('./server/config/globals').twilio;
const twilioClient = require('./server/config/twilio');

// test pattern '*/2 * * * * *'
cron.schedule('*/2 * * * * *', () => {
  const mili24hours = 86400000;
  Appointment.run()
    .then((appointments) => {
      const shouldNotifyAppointments = appointments.filter((appointment) => {
        const now = Date.now();
        const start = appointment.startTime.getTime();
        return (((start - now) <= mili24hours) && appointment.confirmed === false);
      });
      each(shouldNotifyAppointments, (appointment) => {
        Patient.get(appointment.patientId)
          .then((patient) => {
            twilioClient.sendMessage({
              from: twilio.number,
              to: patient.phoneNumber,
              body: `Your Appointment is 24 hours away. Send "${appointment.reminderCode}" to confirm`,
            })
              .then(result => console.log(result));
          });
      });
    })
    .catch(err => console.log(err));
});
