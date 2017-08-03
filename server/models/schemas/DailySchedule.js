
const thinky = require('../../config/thinky');
const { time } = require('../../util/time');
const type = thinky.type;

const eight = time(8, 0);
const five = time(17, 0);

const generateDailyScheduleSchema = (options = {}) => {
  const { isClosed = false, startTime = eight, endTime = five, breaks = [] } = options;
  return type.object().schema({
    isClosed: type.boolean().required().default(isClosed),
    startTime: type.date().required().default(startTime),
    endTime: type.date().required().default(endTime),
    breaks: type.array().default(breaks),
    pmsScheduleId: type.string().uuid(4),
    chairIds: type.array().default([]),
  }).default({
    isClosed: isClosed,
    startTime: startTime,
    endTime: endTime,
    chairIds: [],
    pmsScheduleId: null,
  }).removeExtra();
};

const DailyScheduleSchema = generateDailyScheduleSchema();

module.exports.generateDailyScheduleSchema = generateDailyScheduleSchema;
module.exports = DailyScheduleSchema;
