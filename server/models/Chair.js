
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Chair = createModel('Chair', {
  accountId: type.string().uuid(4).required(),
  name: type.string().required(),
  description: type.string(),
  pmsId: type.string(),
});

module.exports = Chair;
