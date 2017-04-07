

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
const runDashboardFeeds = require('../../../feeds/runDashboardFeeds');

function setupDashboardNamespace(io) {
  const dash = io.of(namespaces.dash);
  return authenticate(dash, (socket) => {
    console.log('socket authenticated!');
    runDashboardFeeds(socket);
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
