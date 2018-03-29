
import cron from 'node-cron';
import { createJob } from '../config/jobQueue';
import GLOBALS from '../config/globals';

const REMINDERS_INTERVAL_MINUTES = GLOBALS.reminders.cronIntervalMinutes;
const REVIEWS_INTERVAL_MINUTES = GLOBALS.reviews.cronIntervalMinutes;
const RECALLS_INTERVAL_MINUTES = GLOBALS.recalls.cronIntervalMinutes;

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// Run every X min
const remindersPattern = `0 */${REMINDERS_INTERVAL_MINUTES} * * * *`;

// Run every X min
const recallsPattern = `0 */${RECALLS_INTERVAL_MINUTES} * * * *`;

// Run every X min
const reviewsPattern = `0 */${REVIEWS_INTERVAL_MINUTES} * * * *`;

// Run every 30 min in prod
const correspondencesPattern = NODE_ENV === 'production' ? '0 15,45 * * * *' : '0 * * * * *';

// Run every 30 min in prod
// Offset to avoid db strain
const patientCachePattern = NODE_ENV === 'production' ? '0 20,50 * * * *' : '0 * * * * *';

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

// Patient last and due hygiene and Recall date job.
cron.schedule(patientCachePattern, () => {
  createJob('patientCache', {}, { ttl: 1000 * 60 * 120 });
});
