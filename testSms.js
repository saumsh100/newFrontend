const twilio = require('twilio');
const cron = require('node-cron');
const Appointment = require('./server/models/Appointment');
const Patient = require('./server/models/Patient');

const twilioConfig = {
  SID: 'ACe874663202cfbbaec4be1ba33869f421',
  AUTH: 'ed5dbadfe331c9bf5898f679a8831b23',
  NUMBER: '+17786558613',
};

const twilioClient = twilio(
  twilioConfig.SID,
  twilioConfig.AUTH
);

/* twilioClient.sendMessage({
  from: twilioConfig.NUMBER,
  to: '+380672552857',
  body: 'Hello',
}).then(result => console.log(result));
*/
// the pattern '0 */30 * * * *'
cron.schedule('*/2 * * * * *', function () {
  const mili24hours = 86400000;
  Appointment.run()
    .then((appointments) => {
      const shouldNotifyAppointments = appointments.filter((appointment) => {
        const now = Date.now();
        const start = appointment.start.getTime();
        return ((start - now) <= mili24hours);
      });
      shouldNotifyAppointments.map((appointment) => {
        Patient.get(appointment.patientId)
          .then((patient) => {
            twilioClient.sendMessage({
              from: twilioConfig.NUMBER,
              to: patient.phoneNumber,
              body: 'Your Appointment is 24 hours away. Press "C" to confirm',
            })
              .then(result => console.log(result));
          });
      });
    })
    .catch(err => console.log(err));
});
