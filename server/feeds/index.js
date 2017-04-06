
const runSyncClientFeeds = require('./runSyncClientFeeds');
const runDashboardFeeds = require('./runDashboardFeeds');

/**
 * runChangeFeeds will create all the necessary changeFeeds that we need
 * and will emit necessary events to clients with io
 *
 * @param io
 */
function runChangeFeeds(io) {
  console.log('Starting changeFeeds...');
  // DEPRECATED, NOT USED AT THE MOMENT
  // runSyncClientFeeds(io);
  // runDashboardFeeds(io);
}

module.exports = runChangeFeeds;
