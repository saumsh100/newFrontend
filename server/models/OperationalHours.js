
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const OperationalHours = createModel('OperationalHours', {
  isClosed: type.boolean().required().default(false),
  startTime: type.date().required(),
  endTime: type.date().required(),
  breaks: type.array(),
});

module.exports = OperationalHours;
