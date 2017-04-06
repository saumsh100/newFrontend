
// TODO: will changes be on the same db connection as API then?
// TODO: If so, we should consider abstracting that so we dont slow up other services
const Appointment = require('../models/Appointment');
const Request = require('../models/Request');

function runDashboardFeeds(socket) {
  const { activeAccountId } = socket.decoded_token;

  // TODO: add feed closing for socket closing!

  // ASSUMPTION: These are the changes coming from the SYNC client...
  Appointment
    .filter({ accountId: activeAccountId, isSyncedWithPMS: true })
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');
        if (doc.getOldValue() === null) {
          // console.log('[ INFO ] CREATE | from=dash; socketId=', socket.id);
          socket.emit('add:Appointment', doc);
          // socket.emit('add:Appointment', normalize('appointment', doc));
        } else {
          // Updated
          // console.log('[ INFO ] UPDATE | from=dash; socketId=', socket.id);
          socket.emit('update:Appointment', doc);
          // socket.emit('update:Appointment', normalize('appointment', doc));
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

module.exports = runDashboardFeeds;
