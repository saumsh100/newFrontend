
import cron from 'node-cron';
import { createJob } from '../config/jobQueue';

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// Run every 30 min in prod
const remindersPattern = NODE_ENV === 'production' ? '0 0,3 * * * *' : '0 * * * * *';

// Run at 5AM every morning
const recallsPattern = NODE_ENV === 'production' ? '* 5 * * *' : '0 * * * * *';

// Appointment Reminders Cron
cron.schedule(remindersPattern, () => {
  createJob('reminders');
});

// Patient Recalls Cron
cron.schedule(recallsPattern, () => {
  createJob('recalls');
});

// TODO: Birthday Messages Cron
// TODO: DigitalWaitList Cron
