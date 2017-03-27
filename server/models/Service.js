
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Service = createModel('Service', {
  name: type.string().required(),
  accountId: type.string().uuid(4).required(),
  duration: type.number().integer().required(),
  bufferTime: type.number().integer(),
  unitCost: type.number(),
  customCosts: type.object().allowNull(),
});

module.exports = Service;
