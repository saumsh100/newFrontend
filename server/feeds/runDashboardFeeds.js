
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const Request = require('../models/Request');
const normalize = require('../routes/api/normalize');

function runDashboardFeeds(socket) {
  const { activeAccountId } = socket.decoded_token;

  // ASSUMPTION: These are the changes coming from the SYNC client...
  Appointment
    .filter({ accountId: activeAccountId, isSyncedWithPMS: true })
    .changes({ squash: true })
    .then((feed) => {
      // TODO should be shutting all feeds associated with this socket, not just one. In one place.
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

  /**
   * Listen to changes on the Requests table and update dashbaords in realtime
   */
  Request
    .filter({ accountId: activeAccountId })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        // console.log('[[INFO]] accountId', accountIdFromSocket);
        if (error) throw new Error('Feed error');
        if (doc.getOldValue() === null) {
          // console.log('[[INFO]] sending', doc);
          console.log('request added');
          socket.emit('addRequest', doc);
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

module.exports = runDashboardFeeds;
