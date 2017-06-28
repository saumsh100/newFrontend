
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { computeRemindersAndSend } from '../lib/reminders';

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('reminders', async (job, done) => {
  const { data: { date } } = job;
  try {
    await computeRemindersAndSend({ date });
    done();
  } catch (err) {
    done(err);
  }
});
