
import cron from 'node-cron';
import { createJob } from '../config/jobQueue';

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// Run every 30 min in prod
const remindersPattern = NODE_ENV === 'production' ? '0 0,30 * * * *' : '0 * * * * *';

// Run at 5AM every morning
const recallsPattern = NODE_ENV === 'production' ? '0 0,30 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const reviewsPattern = NODE_ENV === 'production' ? '0 0,30 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const correspondencesPattern = NODE_ENV === 'production' ? '0 15,45 * * * *' : '0 * * * * *';

// Run 15 min past every 2 hours in prod
const firstNextLastAppointmentPattern = NODE_ENV === 'production' ? '15 */2 * * *' : '0 * * * * *';

// Appointment Reminders Cron
cron.schedule(remindersPattern, () => {
  createJob('reminders');
});

// Patient Recalls Cron
cron.schedule(recallsPattern, () => {
  createJob('recalls');
});

cron.schedule(correspondencesPattern, () => {
  createJob('correspondences');
});

// Patient Reviews Cron
cron.schedule(reviewsPattern, () => {
  createJob('reviews');
});

// Patient First Appointment, Next Appointment, and Last Appointment Cron
cron.schedule(firstNextLastAppointmentPattern, () => {
  createJob('firstNextLastApp');
});

// TODO: Birthday Messages Cron
// TODO: DigitalWaitList Cron
