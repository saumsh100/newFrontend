
const cron = require('node-cron');
const remindersQueue = require('../config/queue/remindersQueue');

const NODE_ENV = process.env.NODE_ENV || 'development';
const cronPattern = NODE_ENV === 'production' ? '0 */30  * * * *' : '0 */1 * * * *';

cron.schedule(cronPattern, () => {
  // Tell the reminders process to compute the reminders that have to be sent
  const job = remindersQueue.createJob({ retryMax: 2, mili24hours: 86400000 });
  remindersQueue.addJob(job)
    .then(savedJobs => console.log('savedJobs', savedJobs))
    .catch(err => console.error(err));
});
