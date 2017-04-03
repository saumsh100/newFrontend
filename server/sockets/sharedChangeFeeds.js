const Appointment = require('../models/Appointment');

/**
 * Any change feeds from RethinkDB that need to "know" about both namespaces
 * need to be here to avoid duplicating this behaviour.
 */
module.exports = (nsp, accountIdFromSocket, isSyncedWithPMS) => {
  /**
   * Listen to changes on appointments and send events to sync client
   */
  Appointment
    .filter({ accountId: accountIdFromSocket, isSyncedWithPMS: isSyncedWithPMS })
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');

        if (doc.getOldValue() === null) {
          console.log('[[INFO]] CREATE | emitting doc=', doc);
          nsp.in(doc.accountId).emit('add:Appointment', doc);
        } else {
          // Updated
          console.log('[[INFO]] updating', doc);
          nsp.in(doc.accountId).emit('add:Appointment', doc);
        }
      });
    });
};
