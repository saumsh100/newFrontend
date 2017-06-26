
import omit from 'lodash/omit';
import {
  createAuxilliaryTables,
  generateUniqueValidator,
} from './auxilliary';
import { db as DB } from '../../config/globals';
import thinky from '../../config/thinky';

const { db } = DB;
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
  const sanitizeFn = config.sanitize;
  const uniqueConfig = config.unique;
  const thinkyConfig = omit(config, ['unique', 'sanitize']);

  // Create the thinky model/tabel
  const Model = thinky.createModel(tableName, schema, {
    ...defaultConfig,
    ...thinkyConfig,
  });

  // Used for error logs
  Model.tableName = tableName;

  /*if (auxConfig) {
    Model.auxModels = createAuxilliaryTables(tableName, auxConfig);
    Model.pre('save', generateUniqueValidator(Model.auxModels));
  }*/
  if (sanitizeFn) {
    Model.sanitize = sanitizeFn;
    Model.docOn('saving', sanitizeFn);
  }

  if (uniqueConfig) {
    Model.uniqueValidate = generateUniqueValidator(uniqueConfig, Model);
    Model.pre('save', Model.uniqueValidate);
  }

  // TODO: add Model helper functionss
  // Model.fetch({  }) filters and joiners to match API and controller requirements
  Model.defineStatic('batchSave', async function (dataArray) {
    let docs = [];
    const errors = [];
    for (const data of dataArray) {
      try {
        // TODO: this could be a bulk insert but it seems too annoying to go around thinky
        // TODO: because of all the schema stuff, so well just do 1by1 for now
        const doc = await this.save(data);
        docs.push(doc);
      } catch (err) {
        errors.push(err);
      }
    }

    if (errors.length) {
      throw { errors, docs };
    }

    return docs;
  });

  // Ultimately what we would use if we could easily separate validate, sanitize, preSave steps
  Model.defineStatic('batchInsert', (docs) => {
    return r.db(db)
      .table(tableName)
      .insert(docs);
  });

  return Model;
}

module.exports = createModel;
