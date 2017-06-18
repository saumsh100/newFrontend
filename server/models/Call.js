
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Call = createModel('Call', {
  id: type.string().required(),
  destinationnum: type.string(),
}, { enforce_extra: false });

module.exports = Call;
