
import cron from 'node-cron';
import jobQueue from '../config/jobQueue';

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';
const cronPattern = NODE_ENV === 'production' ? '0 */3 * * * *' : '0 */1 * * * *';

// Appointment Reminders Cron
cron.schedule(cronPattern, () => {
  // Timestamp it so that all appointments needing reminders are pulled properly
  const date = (new Date()).toISOString();
  const job = jobQueue.create('reminders', { date }).save((err) => {
    if (err) {
      console.error('Creating Reminders Job Failed');
      console.error(err);
    } else {
      console.log('Reminders Job Started', date);
      console.log('Job ID', job.id);
    }
  });

  job.on('complete', () => {
    console.log('Reminders Job Completed');
  }).on('failed attempt', (err, doneAttempts) => {
    console.error('Job Attempt Failed');
    console.error(err);
  }).on('failed', (err) => {
    console.error('Reminders Job Failed');
    console.error(err);
  });
});

// TODO: Recalls Cron
// TODO: Birthday Messages Cron
// TODO: DigitalWaitList Cron
