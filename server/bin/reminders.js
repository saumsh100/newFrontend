
import jobQueue from '../config/jobQueue';
import { computeRemindersAndSend } from '../lib/reminders';

// We could use Heroku Scheduler for this but I have ever tested it - JS
jobQueue.process('reminders', async (job, done) => {
  const { data: { date } } = job;
  try {
    await computeRemindersAndSend({ date });
    done();
  } catch (err) {
    done(err);
  }
});
