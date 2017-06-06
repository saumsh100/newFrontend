
import thinky from '../../config/thinky';
import {
  createTableName,
  createPrimaryKey,
} from './auxilliary';

const { r, type } = thinky;

/**
 * createModel is a wrapper function around thinky.createModel
 * that will add our defaults on sugar functionality
 *
 * @param tableName
 * @param schema
 * @param config
 * @returns {*}
 */
function createModel(tableName, schema, config = {}) {
  schema.id = schema.id || type.string().uuid(4);
  schema.createdAt = type.date().default(r.now());
  const defaultConfig = {
    // Helpful to create from req.body for API endpoints
    enforce_extra: 'remove',
  };

  console.log(`createModel ${tableName} config is `, config);

  const Model = thinky.createModel(tableName, schema, {
    ...defaultConfig,
    ...config,
  });

  // for (each unique field in model) {
  //  create aux tables
  // }

  // Model.preSave(validateUnique);

  // TODO: add Model helper functionss
  // Model.fetch({  }) filters and joiners to match API and controller requirements

  return Model;
}

module.exports = createModel;
