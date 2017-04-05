
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const { namespaces } = require('../config/globals');

function runSyncClientFeeds(io) {
  console.log('Initializing Sync Client Feeds');

  // ASSUMPTION: Assuming these are the changes coming from the Dashboard
  Appointment
    .filter({ isSyncedWithPMS: false })
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (doc.getOldValue() === null) {
          // console.log('[ INFO ] CREATE | from=dash; socketId=', socket.id);
          io.of(namespaces.sync).in(doc.accountId).emit('add:Appointment', doc);
          // socket.emit('add:Appointment', normalize('appointment', doc));
        } else {
          // Updated
          // console.log('[ INFO ] UPDATE | from=dash; socketId=', socket.id);
          io.of(namespaces.sync).in(doc.accountId).emit('update:Appointment', doc);
          // socket.emit('update:Appointment', normalize('appointment', doc));
        }
      });
    });
}

module.exports = runSyncClientFeeds;
