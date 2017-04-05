

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
// const twilioClient = require('../../../config/twilio');
// const twilioConfig = require('../../../config/globals').twilio;

function setupDashboardNamespace(io) {
  const dash = io.of(namespaces.dash);
  return authenticate(dash, (socket) => {
    const { activeAccountId } = socket.decoded_token;

    // TODO: JWT token verification
    // console.log(`dashNsp connection. Joining client to roomName=${roomName}; connected to /dash=`, io.of('/dash').connected);
    console.log(`dashNsp connection. Joining client to roomName=${activeAccountId}; connected to /dash=`);
    console.log('active rooms', JSON.stringify(io.sockets.adapter.rooms));
    socket.join(activeAccountId);

    const room = dash.in(activeAccountId);
    room.emit('newJoin', 'dash board joined'); // notify everyone that someone joined

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
