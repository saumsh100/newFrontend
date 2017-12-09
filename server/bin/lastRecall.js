
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import mostRecentRecallAllAccounts from '../lib/lastRecall';

global.io = createSocketServer();

jobQueue.process('lastRecall', async (job, done) => {
  try {
    await mostRecentRecallAllAccounts();
    done();
  } catch (err) {
    done(err);
  }
});
