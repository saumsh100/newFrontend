
const thinky = require('../config/thinky');
const { r, type } = thinky;

function createModel(tableName, schema) {
  schema.id = type.string().uuid(4);
  schema.createdAt = type.date().default(r.now());
  const Model = thinky.createModel(tableName, schema, {
    // Helpful to create from req.body for API endpoints
    enforce_extra: 'remove',
  });

  // TODO: add Model helper functions

  return Model;
}

module.exports = createModel;
