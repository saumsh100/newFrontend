const Appointment = require('../models/Appointment');
const nsps = require('../config/globals').namespaces;

/**
 * Any change feeds from RethinkDB that need to "know" about both namespaces
 * need to be here to avoid duplicating this behaviour.
 */
module.exports = (io, accountIdFromSocket) => {
  /**
   * Listen to changes on appointments and send events to sync client
   */
  Appointment
    .filter({ accountId: accountIdFromSocket })
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');

        if (doc.getOldValue() === null) {
          if (doc.isSyncedWithPMS) {
            console.log('[[INFO]] emitting to dash', doc);
            io.of(nsps.dash).in(doc.accountId).emit('addAppointment', doc);
          } else {
            console.log('[[INFO]] emitting to sync client');
            io.of(nsps.sync).in(doc.accountId).emit('add:Appointment', doc);
          }
        } else {
          // Updated
          console.log('[[INFO]] updating', doc);
          io.of(nsps.dash).in(doc.accountId).emit('add:Appointment', doc);
        }
      });
    });
};
