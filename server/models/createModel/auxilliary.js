
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

  return thinky.createModel(tableName, {
    [primaryKey]: type.string().required(),
    [value]: type.string().required(),
  }, {
    pk: primaryKey,
  });
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

function preSavingUniqueValidator(doc) {
  // Generate validators to ensure uniqueness on fields
  const validators = map(auxilliaryConfig, (config, fieldName) => {
    const { value, dependencies } = config;
    const tableName = createTableName(fieldName);
    return Promise((resolve, reject) => {
      const dependencyValues = dependencies.map(d => doc[d]);
      const fieldValue = doc[fieldName];
      // Now grab from aux table and see if value equals doc.id
      auxModels[tableName].get(createPrimaryKey(dependencyValues, fieldValue))
        .catch((err) => {
          // assume errors means it does not exist
          // Create entry into this aux table
        })
        .then((auxDoc) => {
          if (auxDoc[value] === doc[value]) {
            console.log('Passed!');
          } else {
            throw new Error(`Unique Field Validation Error: ${fieldName} field must be unique on Model ${modelName}`);
          }
        });
    });
  });

  // Call validators tp throw errors or not
  Promise.all(validators);
}

