import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import computeCorrespondencesAndCreate from '../lib/correspondences';
import connectorWatch from '../lib/connectorWatch';

global.io = createSocketServer();


jobQueue.process('correspondences', async (job, done) => {
  try {
    await computeCorrespondencesAndCreate();
    // putting connector down email cron here as it's not intensive enough
    // to warrant a seperate cron
    await connectorWatch(global.io);
    done();
  } catch (err) {
    done(err);
  }
});
