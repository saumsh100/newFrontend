
const cron = require('node-cron');
const remindersQueue = require('../config/queue/remindersQueue');

// TODO: put these in globals.js
const NODE_ENV = process.env.NODE_ENV || 'development';
const cronPattern = NODE_ENV === 'production' ? '0 */3 * * * *' : '0 */1 * * * *';

// Appointment Reminders Cron
cron.schedule(cronPattern, () => {
  // Tell the reminders process to compute the reminders that have to be sent
  const job = remindersQueue.createJob({ retryMax: 2, mili24hours: 86400000 });
  remindersQueue.addJob(job)
    .then(savedJobs => console.log('savedJobs', savedJobs))
    .catch(err => console.error(err));
});

// TODO: Recalls Cron
// TODO: Birthday Messages Cron
// TODO: DigitalWaitList Cron
