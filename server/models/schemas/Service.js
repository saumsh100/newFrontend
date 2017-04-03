
const thinky = require('../../config/thinky');
const { time } = require('../../util/time');
const type = thinky.type;

const eight = time(8, 0);
const five = time(17, 0);

const DailyScheduleSchema = type.object().schema({
  isClosed: type.boolean().required().default(false),
  startTime: type.date().required().default(eight),
  endTime: type.date().required().default(five),
  breaks: type.array(),
}).default({
  isClosed: false,
  startTime: eight,
  endTime: five,
}).removeExtra();

module.exports = DailyScheduleSchema;