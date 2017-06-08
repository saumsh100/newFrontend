
import thinky from '../../config/thinky';
import pick from 'lodash/pick';
import {
  createAuxilliaryTables,
  generateUniqueValidator,
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

  // Pluck off so that we can create model with appropriate config
  const auxConfig = pick(config, 'aux');
  console.log('createModel: config=', auxConfig);

  // Create the thinky model/tabel
  const Model = thinky.createModel(tableName, schema, {
    ...defaultConfig,
    ...config,
  });


  if (auxConfig) {
    Model.auxModels = createAuxilliaryTables(tableName, auxConfig);

    // TODO: is this the right hook?
    Model.pre('save', generateUniqueValidator(Model.auxModels));
  }

  // TODO: add Model helper functionss
  // Model.fetch({  }) filters and joiners to match API and controller requirements

  return Model;
}

module.exports = createModel;
