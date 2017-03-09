
const thinky = require('../../config/thinky');
const { time } = require('../../util/time');
const type = thinky.type;

const eight = time(8, 0);
const five = time(17, 0);

const DailyScheduleSchema = type.object().schema({
  isClosed: type.boolean().required().default(false),
  startTime: type.object().required().schema({
  	h: type.number(),
  	m: type.number(),
  }).default({ h: 9, m: 30 }),
  endTime: type.object().required().schema({
  	h: type.number(),
  	m: type.number(),
  }).default({ h: 9, m:30 }),
  breaks: type.array(),
}).default({
  isClosed: false,
  startTime: eight,
  endTime: five,
}).removeExtra();

module.exports = DailyScheduleSchema;
