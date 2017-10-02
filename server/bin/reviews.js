
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { computeReviewsAndSend } from '../lib/reviews';

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('reviews', async (job, done) => {
  const { data: { date } } = job;

  try {
    await computeReviewsAndSend({ date });
    done();
  } catch (err) {
    done(err);
  }
});
