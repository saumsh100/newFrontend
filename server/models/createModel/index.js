
import { v4 as uuid } from 'uuid';
import omit from 'lodash/omit';
import uniqWith from 'lodash/uniqWith';
import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';
import {
  createAuxilliaryTables,
  generateUniqueValidator,
} from './auxilliary';
import { UniqueFieldError } from './errors';
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

  /**
   * preValidateArray is used in batchSave to accept an array of docs and
   * - turn them into models
   * - sanitize them
   * - validate them against schema (ensure types...)
   * - and ensure the uniqueness is satisfied within eachother
   * - ensure uniqueness is satisfied against DB
   *
   */
  Model.defineStatic('preValidateArray', async function (docsArray) {
    const errors = [];

    const start = Date.now();
    // turn into models
    let docs = docsArray.map((p) => {
      //p.id = p.id || uuid();
      let patient = new Model(p);

      // sanitize them, mutable function
      patient.emit('saving', patient);
      return patient;
    });

    console.log(`Taken ${Date.now() - start}ms so far...`);

    // now validate and catch any validation errors
    docs = docs.filter((d) => {
      try {
        d.validate(); // TODO what does this validation do? There is no function in model
        return true;
      } catch (error) {
        error.doc = d;
        errors.push(error);
      }
    });

    console.log(`Taken ${Date.now() - start}ms so far...`);

    // Now check check uniqueness against each other
    docs = uniqWith(docs, (a, b) => {
      if (a.id && b.id && a.id === b.id) {
        const error = UniqueFieldError(Model, 'id');
        error.doc = a;
        errors.push(error);
        return true; // TODO why return true here?
      }

      for (const field in uniqueConfig) {
        const fieldConfig = uniqueConfig[field];
        console.log('createModel.preValidateArray() checking field: ', field, 'fieldConfig=', fieldConfig);
        if (!fieldConfig) continue;
        if (isArray(fieldConfig)) {
          // Now check
          let same = a[field] === b[field];
          for (const depField of fieldConfig) {
            same = same && a[depField] === b[depField];
          }

          if (same) {
            const error = UniqueFieldError(Model, field);
            error.doc = a;
            errors.push(error);
            return true;
          }
        } else {
          // Perhaps we need to check objects also?
          if (a[field] === b[field]) {
            const error = UniqueFieldError(Model, field);
            error.doc = a;
            errors.push(error);
            return true;
          }
        }
      }
    });

    console.log(`Taken ${Date.now() - start}ms so far...`);
    console.log('About to unique validate');

    if (Model.uniqueValidate) {
      const finalDocs = [];
      for (const d of docs) {
        try {
          await Model.uniqueValidate.call(d, (err) => {
            if (err) {
              throw err;
            }

            finalDocs.push(d);
          });
        } catch (err) {
          err.doc = d;
          errors.push(err);
        }
      }

      docs = finalDocs;
    }

    return { errors, docs };
  });

  /**
   *
   *
   */
  Model.defineStatic('batchSave', async function (dataArray) {
    // TODO: remove attrs on error docs that will break during send
    console.log('batchSave: saving', dataArray);
    const { docs, errors } = await Model.preValidateArray(dataArray);
    if (!docs.length) {
      throw { errors, docs };
    }

    console.log('About to batch insert');
    try {
      // Bulk Insert... at this point it is assumed to pass!
      const result = await this.batchInsert(docs);
      const { changes, errors } = result;
      if (errors || !isArray(changes)) {
        throw new Error(`An error occurred during the bulk insert. Original results:\n${JSON.stringify(result, null, 2)}`);
      }

      const len = changes.length;
      let i;
      for (i = 0; i < len; i++) {
        const change = changes[i];
        docs[i]._merge(change.new_val);

        // What does this do?
        if (docs[i]._getModel().needToGenerateFields === true) {
          docs[i]._generateDefault();
        }

        docs[i]._setOldValue(cloneDeep(changes[i].old_val));
        docs[i].setSaved();
        docs[i].emit('saved', docs[i]);
      }
      // Merge new_vals into docs so that the all DB added vals are replaced (ids, dates, etc.)


      // console.log('result.changes', result.changes);
    } catch (err) {
      // TODO: what errors could come here...
      console.error('Error batch saving!');
      console.log(err);
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
      .insert(docs, {
        returnChanges: 'always',
      });
  });

  return Model;
}

module.exports = createModel;
