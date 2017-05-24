
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Enterprise = createModel('Enterprise', {
  name: type.string().required(),
});

module.exports = Enterprise;

