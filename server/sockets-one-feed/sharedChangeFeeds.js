const Appointment = require('../models/Appointment');
const normalize = require('../routes/api/normalize');

// module.exports = (nsp, accountIdFromSocket, isSyncedWithPMS, createdBy) => {
module.exports = (syncNsp, dashNsp) => {
  /**
   * No need to filter out anything - events happen when something in this table changes.
   * When it does - we need to handle it no matter what, which is emitting info to the right
   * namespace and room.
   */
  Appointment
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        if (error) throw new Error('Feed error');

        if (doc.getOldValue() === null) {
          console.log('CREATING appointment');
          if (doc.isSyncedWithPMS) {
            console.log(`[ EMIT ] CREATE | nsp=${dashNsp.name}; isSyncedWithPMS=${doc.isSyncedWithPMS}`);
            dashNsp.in(doc.accountId).emit('add:Appointment', normalize('appointment', doc));
          } else {
            console.log(`[ EMIT ] CREATE | nsp=${syncNsp.name}; isSyncedWithPMS=${doc.isSyncedWithPMS}`);
            syncNsp.in(doc.accountId).emit('add:Appointment', normalize('appointment', doc));
          }
        } else {
          console.log('UPDATING appointment');
          if (doc.isSyncedWithPMS) {
            console.log(`[ EMIT ] UPDATE | nsp=${dashNsp.name}; isSyncedWithPMS=${doc.isSyncedWithPMS}`);
            dashNsp.in(doc.accountId).emit('update:Appointment', normalize('appointment', doc));
          } else {
            console.log(`[ EMIT ] UPDATE | nsp=${syncNsp.name}; isSyncedWithPMS=${doc.isSyncedWithPMS}`);
            syncNsp.in(doc.accountId).emit('update:Appointment', normalize('appointment', doc));
          }
        }
      });
    });
};
