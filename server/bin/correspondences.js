import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import computeCorrespondencesAndCreate from '../lib/correspondences';

global.io = createSocketServer();


// We could use Heroku Scheduler for this but I have ever tested it - JSharp
jobQueue.process('correspondences', async (job, done) => {
  try {
    await computeCorrespondencesAndCreate();
    done();
  } catch (err) {
    done(err);
  }
});
