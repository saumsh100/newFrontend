

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
const runDashboardFeeds = require('../../../feeds/runDashboardFeeds');
const twilio = require('../../../config/globals').twilio;
const twilioClient = require('../../../config/twilio');
const Chat = require('../../../models/Chat');
const TextMessage = require('../../../models/TextMessage');
const normalize = require('../../../routes/api/normalize');


function setupDashboardNamespace(io) {
  const dash = io.of(namespaces.dash);
  return authenticate(dash, (socket) => {
    console.log('socket authenticated!');
    runDashboardFeeds(socket);

      socket.on('room', (room) => {
        socket.join(room.id);
      });

    socket.on('say',function(data){
      io.of(namespaces.dash).in('test').emit('message', 'asdads');
      console.log('test2')
    })

      socket.on('sendMessage', (data) => {
      var clients_in_the_room = io.sockets.clients();
      console.log(socket.decoded_token);
      for (var clientId in clients_in_the_room.connected ) {
        console.log('client: %s', clientId); //Seeing is believing
      }
      const mergeData = {
        lastTextMessageDate: new Date(),
      };
      const textMessages = {
        body: data.message,
        chatId: data.chatId,
        to: data.patient.phoneNumber,
        from: twilio.number,
      };
      const joinObject = { patient: true};
      joinObject.textMessages = {
        _apply: (sequence) => {
          // TODO: confirm that the order is correct
          return sequence
            .orderBy('createdAt')
        },
      };

      TextMessage.save(textMessages)
        .then(() => {
          Chat.get(data.chatId).getJoin(joinObject).run()
            .then((chat) => {
              chat.merge(mergeData).save().then((chats) => {
                const send = JSON.stringify(normalize('chat', chats));
                socket.emit('newMessage', send);
              });
            });
        });
      // const {patient, message} = data;
      // twilioClient.sendMessage({
      //   to: patient.phoneNumber,
      //   from: twilio.number,
      //   body: message,
        // statusCallback: 'https://carecru.ngrok.io/twilio/status',
      // }).then((result) => {
      //   // TODO: this is queued, and not delivered, so not techincally sent...
      //   console.log(result);
      //   // TextMessage.save({
      //   //   id: result.sid,
      //   //   to: result.to,
      //   //   from: result.from,
      //   //   body: result.body,
      //   //   status: result.status,
      //   // }).then(tm => console.log('SMS sent and saved', tm))
      //   //   .catch(err => console.log(err));
      // }).catch((err) => {
      //   console.log('Error sending SMS');
      //   console.log(err);
      // });
    });

    // TODO: only keeping this so i dont lose Twilio setup
    /*socket.on('sendMessage', (data) => {
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
     });*/
  });
}

module.exports = setupDashboardNamespace;
