
const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const twilioClient = require('../../../config/twilio');
const twilioConfig = require('../../../config/globals').twilio;
const dashChangeFeeds = require('./dashChangeFeeds');
const Appointment = require('../../../models/Appointment');
const normalize = require('../../../routes/api/normalize');

const nsps = globals.namespaces;

const socketIoOptions = {
  secret: globals.tokenSecret,
  // TODO change to lower value or remove
  timeout: 15000,
};

module.exports = function setupDashNsp(io) {
  io.of(nsps.dash)
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      // console.log(`dashNsp connection. Joining client to roomName=${roomName}; connected to /dash=`, io.of('/dash').connected);
      console.log(`dashNsp connection. Joining client to roomName=${roomName}; connected to /dash=`);
      console.log('active rooms', JSON.stringify(io.sockets.adapter.rooms));
      socket.join(roomName);

      io.of(nsps.dash).in(roomName).emit('newJoin', 'dash board joined'); // notify everyone that someone joined

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

            // close rethinkdb change feed on socket disconnect, not on namespace disconnect
            socket.on('disconnect', () => {
              console.log('[ INFO ] SIO DISCONNECT');
              feed.close();
            });

            if (doc.getOldValue() === null) {
              console.log('[ INFO ] CREATE | from=dash; socketId=', socket.id);
              // io.of('/dash').in(doc.accountId).emit('add:Appointment', doc);
              socket.emit('add:Appointment', normalize('appointment', doc));
            } else {
              // Updated
              console.log('[ INFO ] UPDATE | from=dash; socketId=', socket.id);
              // io.of('/dash').in(doc.accountId).emit('add:Appointment', doc);
              socket.emit('update:Appointment', normalize('appointment', doc));
            }
          });
        });
    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
};
