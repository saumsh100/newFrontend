
import cron from 'node-cron';
import { createJob } from '../config/jobQueue';
import GLOBALS from '../config/globals';

const REMINDERS_INTERVAL_MINUTES = GLOBALS.reminders.cronIntervalMinutes;

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// Run every X min in prod
const remindersPattern = NODE_ENV === 'production' ? `0 0,${REMINDERS_INTERVAL_MINUTES} * * * *` : '0 * * * * *';

// Run at 5AM every morning
const recallsPattern = NODE_ENV === 'production' ? '0 0,30 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const reviewsPattern = NODE_ENV === 'production' ? '0 0,30 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const correspondencesPattern = NODE_ENV === 'production' ? '0 15,45 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const lastHygienePattern = NODE_ENV === 'production' ? '0 20,50 * * * *' : '0 * * * * *';

// Run every 30 min in prod
const lastRecallPattern = NODE_ENV === 'production' ? '0 10,40 * * * *' : '0 * * * * *';

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

// Creating correspondences for reminders sent and confirmed
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

// Patient First Appointment, Next Appointment, and Last Appointment Cron
cron.schedule(lastHygienePattern, () => {
  createJob('lastHygiene');
});

cron.schedule(lastRecallPattern, () => {
  createJob('lastRecall');
});
