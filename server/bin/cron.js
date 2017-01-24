
const cron = require('node-cron');
const remindersQueue = require('../config/queue/remindersQueue');

cron.schedule('*/20 * * * * *', () => {
  // Tell the reminders process to compute the reminders that have to be sent
  const testData = Date.now();
  remindersQueue.addJob({ testData })
    .then(savedJobs => console.log('savedJobs', savedJobs))
    .catch(err => console.error(err));
});
