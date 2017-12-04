
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import mostRecentHygieneAllAccounts from '../lib/lastHygiene';

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('lastHygiene', async (job, done) => {
  try {
    await mostRecentHygieneAllAccounts();
    done();
  } catch (err) {
    done(err);
  }
});
