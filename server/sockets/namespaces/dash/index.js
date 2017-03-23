const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const normalize = require('../../../routes/api/normalize');
const twilioClient = require('../../../config/twilio');
const twilioConfig = require('../../../config/globals').twilio;
const Appointment = require('../../../models/Appointment');
const Patient = require('../../../models/Patient');
const TextMessage = require('../../../models/TextMessage');
const Request = require('../../../models/Request');

module.exports = function setupDashNsp(io) {
  const dashNsp = io.of('/dash');

  dashNsp
    .on('connection', socketIoJwt.authorize({
      secret: globals.tokenSecret,
      timeout: 30000,
    }))
    .on('authenticated', (socket) => {
      const roomName = socket.decoded_token.activeAccountId;
      console.log(`dashNsp connection. roomName=${roomName}`);

      socket.join(roomName);
      console.log('active rooms', io.sockets.adapter.rooms);
      console.log(`Opening room: ${roomName}`);
      dashNsp.in(roomName).emit('newJoin', 'dash board joined'); // notify everyone that someone joined

      socket.on('sendToRoom', (data) => {
        const room = io.nsps['/dash'].adapter.rooms[roomName];
        console.log('clients in this room: ', room.length);
        console.log(`Sending to all in the room ${roomName}: data=${data.msg}`);

        dashNsp.in(roomName).emit('roomMessage', `${data.msg} ${roomName}`);
      });

      /* ARE ANY OF THESE USED ???? */
      socket.on('fetchAppointments', () => {
        Appointment.run()
          .then((appointments) => {
            //socket.emit('receiveAppointments', appointments);
            dashNsp.in(roomName).emit('receiveAppointments', appointments);
          });
      });

      socket.on('fetchPatients', () => {
        Patient.run()
          .then((patients) => {
            //socket.emit('receivePatients', patients);
            dashNsp.in(roomName).emit('receivePatients', patients);
          });
      });

      socket.on('fetchPatient', ({ id }) => {
        Patient.get(id)
          .then((patient) => {
            dashNsp.in(roomName).emit('receivePatient', patient);
          });
      });

      socket.on('addAppointment', (data) => {
        new Appointment(data).save().then((appointment) => {
          dashNsp.in(roomName).emit('appointmentAdded', appointment);
        });
      });

      socket.on('removeAppointment', (data) => {
        Appointment.get(data.id).then((appointment) => {
          appointment.delete()
            .then((result) => {
              dashNsp.in(roomName).emit('appointmentRemoved', result);
            });
        });
      });

      socket.on('syncClientTrigger', (data) => {
        console.log('sync client triggers!', 'data:', data);
      });
      /* ARE ANY OF THESE USED ^^^^ */


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
            dashNsp.in(roomName).emit('addRequest', doc);
          }
        });
      });
    });

  return dashNsp;
};
