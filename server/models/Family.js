const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Family = createModel('Family', {
  accountId: type.string().required(),
  pmsId: type.string(),
  headId: type.string(),
});

module.exports = Family;
