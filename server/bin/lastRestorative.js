
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import mostRecentRestorativeAllAccounts from '../lib/lastRestorative';

global.io = createSocketServer();

jobQueue.process('lastRestorative', async (job, done) => {
  try {
    await mostRecentRestorativeAllAccounts();
    done();
  } catch (err) {
    done(err);
  }
});
