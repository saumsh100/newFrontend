
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const normalize = require('../routes/api/normalize');

function runSyncClientFeeds(socket) {
  const { activeAccountId } = socket.decoded_token;
  // ASSUMPTION: Assuming these are the changes coming from the Dashboard
  /*Appointment
    .filter({ accountId: activeAccountId, isBatch: false })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (!doc.isSyncedWithPms) {
          if (isDeleted(doc)) {
            console.log(`SYNC RM: NOT emitting. Removing appointments; account=${doc.accountId},id=${doc.id}; pmsId=${doc.pmsId}`);
            // socket.emit('remove:Appointment', normalize('appointment', doc));
          } else if (isCreated(doc)) {
            console.log(`SYNC CREA: appointments; account=${doc.accountId}, id=${doc.id}; pmsId=${doc.pmsId}`);
            socket.emit('create:Appointment', normalize('appointment', doc));
          } else {
            console.log(`SYNC UPDT: appointments; account=${doc.accountId}, id=${doc.id}; pmsId=${doc.pmsId}`);
            socket.emit('update:Appointment', normalize('appointment', doc));
          }
        }
      });
    });

  Patient
    .filter({ accountId: activeAccountId, isBatch: false })
    .changes({ squash: true })
    .then((feed) => {
      setupFeedShutdown(socket, feed);

      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');

        console.log('SYNC FEED.PATIENT');

        if (!doc.isSyncedWithPms) {
          if (isDeleted(doc)) {
            console.log(`SYNC RM: NOT emitting. Removing patient; account=${doc.accountId},id=${doc.id}; pmsId=${doc.pmsId}`);
            // socket.emit('remove:Patient', normalize('patient', doc));
          } else if (isCreated(doc)) {
            console.log(`SYNC CREA: Creating patient; account=${doc.accountId},id=${doc.id}; pmsId=${doc.pmsId}`);
            socket.emit('create:Patient', normalize('patient', doc));
          } else {
            console.log(`SYNC UPDT: Updating patient; account=${doc.accountId},id=${doc.id}; pmsId=${doc.pmsId}`);
            socket.emit('update:Patient', normalize('patient', doc));
          }
        }
      });
    });*/
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
