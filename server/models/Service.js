const thinky = require('../config/thinky');
const type = thinky.type;

const Service = thinky.createModel('Service', {
  id: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  name: type.string().required(),
  practitioners: [ type.string().uuid(4) ],
  duration: type.number().integer().required(),
  bufferTime: type.number().integer(),
  unitCost: type.number(),
  customCosts: type.object().allowNull(),
});

module.exports = Service;
