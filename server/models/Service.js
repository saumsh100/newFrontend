
const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const Service = createModel('Service', {
  name: type.string().required(),
  accountId: type.string().uuid(4).required(),

 // practitioners: [ type.string().uuid(4) ],

  duration: type.number().integer().required(),
  bufferTime: type.number().integer(),
  unitCost: type.number(),
  customCosts: type.object().allowNull(),
  pmsId: type.string(),
  isActive: type.boolean().default(true),

  //allowedPractitioners: [ type.string().uuid(4) ],

});

module.exports = Service;
