
const thinky = require('../config/thinky');

function createModel(tableName, schema) {
  const Model = thinky.createModel(tableName, schema, {
    enforce_extra: 'remove',
  });

  // TODO: add Model helper functions

  return Model;
}

module.exports = createModel;
