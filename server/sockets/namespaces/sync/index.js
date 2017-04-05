

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
// const twilioClient = require('../../../config/twilio');
// const twilioConfig = require('../../../config/globals').twilio;

function setupSyncNamespace(io) {
  const sync = io.of(namespaces.sync);
  return authenticate(sync, (socket) => {
    const { activeAccountId } = socket.decoded_token;

    // TODO: JWT token verification
    // console.log(`syncNsp connection. Joining client to roomName=${roomName}; connected to /sync=`, io.of('/sync').connected);
    console.log(`syncNsp connection. Joining client to roomName=${activeAccountId}; connected to /sync=`);
    console.log('active rooms', JSON.stringify(io.sockets.adapter.rooms));
    socket.join(activeAccountId);

    const room = sync.in(activeAccountId);
    room.emit('newJoin', 'sync board joined'); // notify everyone that someone joined
  });
}

module.exports = setupSyncNamespace;
