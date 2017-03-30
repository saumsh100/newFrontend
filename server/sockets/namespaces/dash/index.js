const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const twilioClient = require('../../../config/twilio');
const twilioConfig = require('../../../config/globals').twilio;
// const Appointment = require('../../../models/Appointment');
const TextMessage = require('../../../models/TextMessage');
const Request = require('../../../models/Request');
const sharedChangeFeeds = require('../../sharedChangeFeeds');

const socketIoOptions = {
  secret: globals.tokenSecret,
  timeout: 5000,
};

module.exports = function setupDashNsp(io) {
  const dashNsp = io.of('/dash');

  dashNsp
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      console.log(`dashNsp connection. Joining client to roomName=${roomName}`);
      console.log('active rooms', io.sockets.adapter.rooms);
      socket.join(roomName);

      dashNsp.in(roomName).emit('newJoin', 'dash board joined'); // notify everyone that someone joined

      socket.on('sendToRoom', (data) => {
        const room = dashNsp.adapter.rooms[roomName];
        console.log('clients in this room: ', room.length);
        console.log(`Sending to all in the room ${roomName}: data=${data.msg}`);

        dashNsp.in(roomName).emit('roomMessage', `${data.msg} ${roomName}`);
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
       * TODO this may break due to rooms and namespaces.
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
            dashNsp.in(doc.accountId).emit('newTextMessage', doc);
          } else {
            console.log('feed received updated message:', doc.status);
            dashNsp.in(doc.accountId).emit('updatedTextMessage', doc);
          }
        });
      });

      /**
       * Listen to changes on the Requests table
       * TODO batching
       */
      Request
        .filter({ accountId: accountIdFromSocket })
        .changes({ squash: true })
        .then((feed) => {
          feed.each((error, doc) => {
            // console.log('[[INFO]] accountId', accountIdFromSocket);
            if (error) throw new Error('Feed error');
            if (doc.getOldValue() === null) {
              // console.log('[[INFO]] sending', doc);
              dashNsp.in(doc.accountId).emit('addRequest', doc);
            }
          });
        });


      sharedChangeFeeds(io, accountIdFromSocket);

    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });

  return dashNsp;
};
