
import { v4 as uuid } from 'uuid';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import thinky from '../../config/thinky';

const { r, type } = thinky;
const TABLE_NAME_DELIMETER = '_';
const PRIMARY_KEY_DELIMETER = '.';

/**
 * createTableName does...
 *
 * @param modelName
 * @param fieldName
 * @returns {string}
 */
export function createTableName(modelName, fieldName) {
  return `${modelName}${TABLE_NAME_DELIMETER}${fieldName}`;
}

/**
 * createPrimaryKey does...
 *
 * @param dependencies
 * @param fieldName
 * @returns {string}
 */
export function createPrimaryKey(dependencies, fieldName) {
  return dependencies.length ?
    `${fieldName}${PRIMARY_KEY_DELIMETER}${dependencies.join(PRIMARY_KEY_DELIMETER)}` :
    fieldName;
}

/**
 * createAuxilliaryTables does...
 *
 * @returns {{}}
 */
export function createAuxilliaryTables(modelName, auxConfig) {
  return mapValues(auxConfig, (config, fieldName) => {
    return createAuxilliaryTable(modelName, fieldName, config);
  });
}

/**
 *
 * @param modelName model that this table is for
 * @param fieldName name of the unique field that this table is for
 * @param config is Object with {@code { value: '', dependencies: [] } }
 */
export function createAuxilliaryTable(modelName, fieldName, config) {
  const {
    value,
    dependencies = [],
  } = config;

  const tableName = createTableName(modelName, fieldName);
  const primaryKey = createPrimaryKey(dependencies, fieldName);

  const primaryKeyType = dependencies.length ?
    type.array().required() :
    type.string().required();

  const AuxTable = thinky.createModel(tableName, {
    [primaryKey]: primaryKeyType,
    [value]: type.string().required(),
  }, {
    pk: primaryKey,
  });

  AuxTable.fieldName = fieldName;
  AuxTable.tableName = tableName;
  AuxTable.primaryKey = primaryKey;
  AuxTable.config = config;

  return AuxTable;
}

export function generateAuxValidators(auxTables, doc) {
  return map(auxTables, (AuxTable) => {
    const {
      config,
      fieldName,
      primaryKey,
      tableName,
    } = AuxTable;

    const {
      value,
      dependencies = [],
    } = config;

    return new Promise((resolve, reject) => {
      // FieldValue will either be a simple string or compounded with an array if dependencies
      let fieldValue = doc[fieldName];
      if (dependencies.length) {
        // d is a field name in doc
        const dependencyValues = dependencies.map(d => doc[d]);
        fieldValue = [fieldValue, ...dependencyValues];
      }


      // Now grab from aux table and see if value equals doc.id
      AuxTable.get(fieldValue)
        .then((auxDoc) => {
          console.log('auxDoc', auxDoc);
          if (auxDoc[value] === doc[value]) {
            resolve();
          } else {
            // reject(new Error(`Unique Field Validation Error: ${fieldName} field must be unique on Model ${modelName}`));
            console.log('ERROR rejecting write', doc);
            reject(new Error('Unique Field Validation Error'));
          }
        })
        .catch((err) => {
          // TODO: should make sure it is a "document not found" error
          // assume errors means it does not exist
          // Create entry into this aux table
          console.log('caught error in AuxTable.get', err);
          let storeValue = doc[value];
          // if (!doc.isSaved() && value === 'id' && !storeValue) {
          //   storeValue = uuid();
          //   doc.id = storeValue;
          // }

          if (!doc.getOldValue() && value === 'id' && !storeValue) {
            // handle create
            console.log('>>>>>>>>>>>>> generateAuxValidators: create', doc);
            storeValue = uuid();
            doc.id = storeValue;
          } else if (!doc.isSaved) {
            // handle delete
            console.log('>>>>>>>>>>>>> generateAuxValidators: delete', doc);
          } else {
            // handle update
            console.log('>>>>>>>>>>>>> generateAuxValidators: update', doc);
            console.log('>>>>>>>>>>>>> generateAuxValidators: update: oldValue', doc.getOldValue());
          }
          console.log('..... doc old value', doc.getOldValue());

          // TODO handle doc updates by checking for `doc.isSaved && doc.getOldValue() !==null`
          // if (updating && fieldChanged) {
          //   AuxTable.get(oldPrimaryKey).then(update it)
          // }

          AuxTable.save({
            [primaryKey]: fieldValue,
            [value]: storeValue,
          }).then((entry) => {
            console.log(`Added unique fieldValue=${fieldValue} to ${tableName} table`);
            resolve();
          });
        });
    });
  });
}

export function generateUniqueValidator(auxTables) {
  // Generate validators to ensure uniqueness on fields

  /**
   * Called on preSave & preUpdate hooks to ensure that the Model is not
   * creating duplicates, if not and it doesn't exist it adds it.
   *
   * @type {Array}
   */
  return function (next) {
    // Run all aux validators
    const self = this;
    Promise.all(generateAuxValidators(auxTables, self))
      .then(() => {
        console.log(`Validation Passed!`);
        next();
        // TODO: how do we handle this, do we call next() or what?
      })
      .catch((err) => {
        console.error('Failed Validation!');
        console.error(err);
        next(err);
        // TODO: how do we handle this, do we throw the error or call next(err) or what?
      });
  };
}

