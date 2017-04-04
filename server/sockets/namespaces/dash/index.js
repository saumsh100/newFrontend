const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const twilioClient = require('../../../config/twilio');
const twilioConfig = require('../../../config/globals').twilio;
const sharedChangeFeeds = require('../../sharedChangeFeeds');
const dashChangeFeeds = require('./dashChangeFeeds');
const Appointment = require('../../../models/Appointment');

const nsps = globals.namespaces;

const socketIoOptions = {
  secret: globals.tokenSecret,
  timeout: 5000,
};

module.exports = function setupDashNsp(io) {
  io.of(nsps.dash)
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      console.log(`dashNsp connection. Joining client to roomName=${roomName}`);
      console.log('active rooms', io.sockets.adapter.rooms);
      socket.join(roomName);

      io.of(nsps.dash).in(roomName).emit('newJoin', 'dash board joined'); // notify everyone that someone joined

      socket.on('sendToRoom', (data) => {
        const room = io.of(nsps.dash).adapter.rooms[roomName];
        console.log('clients in this room: ', room.length);
        console.log(`Sending to all in the room ${roomName}: data=${data.msg}`);

        io.of(nsps.dash).in(roomName).emit('roomMessage', `${data.msg} ${roomName}`);
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
          // TextMessage.save({
          //   id: result.sid,
          //   to: result.to,
          //   from: result.from,
          //   body: result.body,
          //   status: result.status,
          // }).then(tm => console.log('SMS sent and saved', tm))
          //   .catch(err => console.log(err));
        }).catch((err) => {
          console.log('Error sending SMS');
          console.log(err);
        });
      });

      dashChangeFeeds(io, accountIdFromSocket);

      Appointment
        .filter({ accountId: accountIdFromSocket, isSyncedWithPMS: true })
        .changes({ squash: true })
        .then((feed) => {
          feed.each((error, doc) => {
            if (error) throw new Error('Feed error');

            if (doc.getOldValue() === null) {
              console.log('[ INFO ] CREATE | from=dash', doc, 'socketId=', socket.id);
              io.of('/dash').in(doc.accountId).emit('add:Appointment', doc);
            } else {
              // Updated
              console.log('[ INFO ] UPDATE from=dash', doc, 'socketId=', socket.id);
              io.of('/dash').in(doc.accountId).emit('add:Appointment', doc, 'socketId=', socket.id);
            }
          });
        });
    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
};
