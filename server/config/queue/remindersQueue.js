
const createQueue = require('./createQueue');

const remindersQueue = createQueue('RemindersQueue');

module.exports = remindersQueue;
