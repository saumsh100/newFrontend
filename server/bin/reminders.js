
const remindersQueue = require('../config/queue/remindersQueue');

remindersQueue.process((job, next) => {
  console.log('reminders process is computing reminders!');
  console.log('testData', job.testData);
});
