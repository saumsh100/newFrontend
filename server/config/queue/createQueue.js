
const Queue = require('rethinkdb-job-queue');
const globals = require('../globals');

module.exports = function createQueue(name) {
  return new Queue(globals.db, { name });
};
