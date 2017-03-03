
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const DailySchedule = createModel('DailySchedule', {
  isClosed: type.boolean().required().default(false),
  startTime: type.date().required(),
  endTime: type.date().required(),
  breaks: type.array(),
});

module.exports = DailySchedule;
