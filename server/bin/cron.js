
import cron from 'node-cron';
import jobQueue from '../config/jobQueue';

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';
const cronPattern = NODE_ENV === 'production' ? '0 */3 * * * *' : '0 */1 * * * *';

// Appointment RemindersList Cron
cron.schedule(cronPattern, () => {
  // Timestamp it so that all appointments needing reminders are pulled properly
  const date = (new Date()).toISOString();
  const job = jobQueue.create('reminders', { date }).save((err) => {
    if (err) {
      console.error('Creating RemindersList Job Failed');
      console.error(err);
    } else {
      console.log('RemindersList Job Started', date);
      console.log('Job ID', job.id);
    }
  });

  job.on('complete', () => {
    console.log('RemindersList Job Completed');
  }).on('failed attempt', (err, doneAttempts) => {
    console.error('Job Attempt Failed');
    console.error(err);
  }).on('failed', (err) => {
    console.error('RemindersList Job Failed');
    console.error(err);
  });
});

// TODO: Recalls Cron
// TODO: Birthday Messages Cron
// TODO: DigitalWaitList Cron
