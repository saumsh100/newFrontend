
const http = require('http');
const globals = require('../config/globals');
const app = require('./app');
const twilioClient = require('../config/twilio');
const twilioConfig = require('../config/globals').twilio;
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const TextMessage = require('../models/TextMessage');
const Request = require('../models/Request');

const server = http.createServer(app);

const io = require('socket.io')(server);

// TODO: implement Thinky!!!
io.on('connection', (socket) => {
  console.log('a new socket connected');
  socket.on('fetchAppointments', () => {
    Appointment.run()
      .then((appointments) => {
        socket.emit('receiveAppointments', appointments);
      });
  });

  socket.on('fetchPatients', () => {
    Patient.run()
      .then((patients) => {
        socket.emit('receivePatients', patients);
      });
  });

  socket.on('fetchPatient', ({ id }) => {
    Patient.get(id)
      .then((patient) => {
        socket.emit('receivePatient', patient);
      });
  });

  socket.on('addAppointment', (data) => {
    new Appointment(data).save().then((appointment) => {
      io.sockets.emit('appointmentAdded', appointment);
    });
  });

  socket.on('removeAppointment', (data) => {
    Appointment.get(data.id).then((appointment) => {
      appointment.delete()
        .then((result) => {
          io.sockets.emit('appointmentRemoved', result);
        });
    });
  });

  socket.on('syncClientTrigger', (data) => {
    console.log('sync client triggers!', 'data:', data);
  });

  socket.on('sendMessage', (data) => {
    const { patient, message } = data;
    twilioClient.sendMessage({
      to: patient.phoneNumber,
      from: twilioConfig.number,
      body: message,
      // statusCallback: 'https://carecru.ngrok.io/twilio/status',
    }).then((result) => {
      // TODO: this is queued, and not delivered, so not techincally sent...
      console.log(result);
      /*TextMessage.save({
        id: result.sid,
        to: result.to,
        from: result.from,
        body: result.body,
        status: result.status,
      }).then(tm => console.log('SMS sent and saved', tm))
        .catch(err => console.log(err));*/
    }).catch((err) => {
      console.log('Error sending SMS');
      console.log(err);
    });
  });

  /**
   * Listen to changes on texts and publish events for new
   */
  TextMessage.changes().then((feed) => {
    feed.each((error, doc) => {
      if (error) {
        throw new Error('Feed error');
      }
      if (doc.isSaved() === false) {
        throw new Error('Deleting TextMessages is not implemented!');
      } else if (doc.getOldValue() == null) {
        console.log('feed received new message');
        socket.emit('newTextMessage', doc);
      } else {
        console.log('feed received updated message:', doc.status);
        socket.emit('updatedTextMessage', doc);
      }
    });
  });

  /**
   * Listen to changes on the Requests table
   */
  Request.changes().then((feed) => {
    feed.each((error, doc) => {
      if (error) throw new Error('Feed error');
      if (doc.getOldValue() === null) {
        console.log('feed received new request');
        socket.emit('addRequest', doc);
      }
    });
  });

});

server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
});
