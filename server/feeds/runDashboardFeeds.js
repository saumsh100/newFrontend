
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const Request = require('../models/Request');
const Patient = require('../models/Patient');
const WaitSpot = require('../models/WaitSpot');
const SyncClientError = require('../models/SyncClientError');
const normalize = require('../routes/api/normalize');

function runDashboardFeeds(socket) {
  const { activeAccountId } = socket.decoded_token;

  // ASSUMPTION: These are the changes coming from the SYNC client...
  Appointment
    .filter({ accountId: activeAccountId })
    .changes({ squash: true })
    .then((feed) => {
      // TODO should be shutting all feeds associated with this socket, not just one. In one place
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        //if (doc.isSyncedWithPMS) {
          if (isDeleted(doc)) {
            socket.emit('remove:Appointment', doc.id);
          } else if (isCreated(doc)) {
            socket.emit('create:Appointment', normalize('appointment', doc));
          } else {
            socket.emit('update:Appointment', normalize('appointment', doc));
          }
        //}
      });
    });

  Patient
    .filter({ accountId: activeAccountId })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (doc.isSyncedWithPMS) {
          if (isDeleted(doc)) {
            socket.emit('remove:Patient', doc.id);
          } else if (isCreated(doc)) {
            socket.emit('create:Patient', normalize('patient', doc));
          } else {
            socket.emit('update:Patient', normalize('patient', doc));
          }
        }
      });
    });

  /**
   * Listen to changes on the Requests table and update dashboards in real time
   */
  Request
    .filter({ accountId: activeAccountId })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (isDeleted(doc)) {
          socket.emit('remove:Request', doc.id);
        } else if (isCreated(doc)) {
          socket.emit('create:Request', normalize('request', doc));
        } else {
          socket.emit('update:Request', normalize('request', doc));
        }
      });
    });

  /**
   * Listen to changes on the Waitspot table and update dashboards in real time
   */
  WaitSpot
    .filter({ accountId: activeAccountId })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (isDeleted(doc)) {
          socket.emit('remove:WaitSpot', doc.id);
        } else if (isCreated(doc)) {
          socket.emit('create:WaitSpot', normalize('waitSpot', doc));
        } else {
          socket.emit('update:WaitSpot', normalize('waitSpot', doc));
        }
      });
    });

  /**
   * Listen to changes on the SyncClientError table to update dashboards in real time.
   * Artificially set up the document from the feed for the normalizer.
   */
  SyncClientError
    .filter({ accountId: activeAccountId })
    .filter((entry) => {
      return entry('operation').ne('sync');
    })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, logEntry) => {
        // stacktrace attribute can be very large and does not mean anything for the dashboard.
        delete logEntry.stackTrace;
        socket.emit('syncClientError', normalize('syncClientError', logEntry));
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
