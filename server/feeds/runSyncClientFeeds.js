
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const normalize = require('../routes/api/normalize');

function runSyncClientFeeds(socket) {
  const { activeAccountId } = socket.decoded_token;

  // ASSUMPTION: Assuming these are the changes coming from the Dashboard
  Appointment
    .filter({ accountId: activeAccountId, isSyncedWithPMS: false })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');


        if (isDeleted(doc)) {
          socket.emit('remove:Appointment', normalize('appointment', doc));
        } else if (isCreated(doc)) {
          socket.emit('add:Appointment', normalize('appointment', doc));
        } else {
          socket.emit('update:Appointment', normalize('appointment', doc));
        }
      });
    });
}

function isDeleted(doc) {
  return doc.isSaved() === false;
}

function isCreated(doc) {
  return doc.getOldValue() === null;
}

/**
 * Convenience function.
 * Will close the feed associated with a given socket.
 * @param socket
 * @param feed
 */
function setupFeedShutdown(socket, feed) {
  socket.on('disconnect', () => {
    console.log('EVENT | disconnect | closing feed.');
    feed.close();
  });
}

module.exports = runSyncClientFeeds;
