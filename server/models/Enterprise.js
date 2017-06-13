
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Enterprise = createModel('Enterprise', {
  name: type.string().required(),
  plan: type.string().enum(['GROWTH', 'ENTERPRISE']).default('GROWTH'),
  // TODO: add address, country, etc.
  // TODO: stripeId?
});

module.exports = Enterprise;
