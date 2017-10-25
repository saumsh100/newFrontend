
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { computeRecallsAndSend } from '../lib/recalls';

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have ever tested it - JSharp
jobQueue.process('recalls', async (job, done) => {
  const { data: { date } } = job;
  try {
    await computeRecallsAndSend({ date });
    done();
  } catch (err) {
    done(err);
  }
});
