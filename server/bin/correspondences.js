import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import computeCorrespondencesAndCreate from '../lib/correspondences';

global.io = createSocketServer();


jobQueue.process('correspondences', async (job, done) => {
  try {
    await computeCorrespondencesAndCreate();
    done();
  } catch (err) {
    done(err);
  }
});
