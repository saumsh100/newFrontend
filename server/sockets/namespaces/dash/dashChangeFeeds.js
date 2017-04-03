const TextMessage = require('../../../models/TextMessage');
const Request = require('../../../models/Request');
const globals = require('../../../config/globals');

const nsps = globals.namespaces;

module.exports = function dashChangeFeeds(io, accountIdFromSocket) {
  /**
   * Listen to changes on texts and publish events for new
   * TODO this may break due to rooms and namespaces.
   */
  TextMessage.changes().then((feed) => {
    feed.each((error, doc) => {
      if (error) {
        throw new Error('Feed error');
      }
      if (doc.isSaved() === false) {
        throw new Error('Deleting TextMessages is not implemented!');
      } else if (doc.getOldValue() == null) {
        console.log('feed received new message');
        io.of(nsps.dash).in(doc.accountId).emit('newTextMessage', doc);
      } else {
        console.log('feed received updated message:', doc.status);
        io.of(nsps.dash).in(doc.accountId).emit('updatedTextMessage', doc);
      }
    });
  });

  /**
   * Listen to changes on the Requests table
   * TODO batching
   */
  Request
    .filter({ accountId: accountIdFromSocket })
    .changes({ squash: true })
    .then((feed) => {
      feed.each((error, doc) => {
        // console.log('[[INFO]] accountId', accountIdFromSocket);
        if (error) throw new Error('Feed error');
        if (doc.getOldValue() === null) {
          // console.log('[[INFO]] sending', doc);
          io.of(nsps.dash).in(doc.accountId).emit('addRequest', doc);
        }
      });
    });
};
