
import thinky from '../../config/thinky';
import omit from 'lodash/omit';
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
  const auxConfig = config.aux;
  const thinkyConfig = omit(config, 'aux');

  // Create the thinky model/tabel
  const Model = thinky.createModel(tableName, schema, {
    ...defaultConfig,
    ...thinkyConfig,
  });


  if (auxConfig) {
    console.log('createModel: auxConfig=', auxConfig);
    Model.auxModels = createAuxilliaryTables(tableName, auxConfig);
    Model.pre('save', generateUniqueValidator(Model.auxModels));
  }

  // TODO: add Model helper functionss
  // Model.fetch({  }) filters and joiners to match API and controller requirements

  return Model;
}

module.exports = createModel;
