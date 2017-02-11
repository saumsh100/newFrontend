const thinky = require('../config/thinky');
const type = thinky.type;

const Chair = thinky.createModel('Chair', {
  id: type.string().uuid(4),
  accountId: type.string().uuid(4),
  name: type.string().required(),
  description: type.string(),
});

module.exports = Chair;
