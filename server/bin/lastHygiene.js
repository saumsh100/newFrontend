
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import mostRecentHygieneAllAccounts from '../lib/lastHygiene';

global.io = createSocketServer();

jobQueue.process('lastHygiene', async (job, done) => {
  try {
    await mostRecentHygieneAllAccounts();
    done();
  } catch (err) {
    done(err);
  }
});
