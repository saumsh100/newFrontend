
import each from 'lodash/each';
import mapValues from 'lodash/map';
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

/**
 * createAuxilliaryTables does...
 *
 * @returns {{}}
 */
export function createAuxilliaryTables(modelName, auxConfig) {
  return mapValues(auxConfig, (config, fieldName) => (
    createAuxilliaryTable(modelName, fieldName, config)
  ));
}

export function generateAuxValidators(auxTables, doc) {
  return mapValues(auxTables, (AuxTable) => {
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

    return Promise((resolve, reject) => {
      // FieldValue will either be a simple string or compounded with an array if dependencies
      let fieldValue = doc[fieldName];
      if (dependencies.length) {
        const dependencyValues = dependencies.map(d => doc[d]);
        fieldValue = [fieldValue, ...dependencyValues];
      }

      // Now grab from aux table and see if value equals doc.id
      AuxTable.get(fieldValue)
      // Catch first cause errors
        .catch((err) => {
          // TODO: should make sure it is a "document not found" error
          // assume errors means it does not exist
          // Create entry into this aux table
          AuxTable.save({
            [primaryKey]: fieldValue,
            [value]: doc[value],
          }).then((entry) => {
            console.log(`Added unique fieldValue=${fieldValue} to ${tableName} table`);
            resolve();
          });
        })
        .then((auxDoc) => {
          if (auxDoc[value] === doc[value]) {
            resolve();
          } else {
            reject(new Error(`Unique Field Validation Error: ${fieldName} field must be unique on Model ${modelName}`));
          }
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

