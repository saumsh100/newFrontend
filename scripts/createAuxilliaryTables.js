
import each from 'lodash/each';
import map from 'lodash/map';

const auxilliaryConfig = {
  mobilePhoneNumber: {
    value: 'id',
    dependencies: ['accountId'],
  },

  email: {
    value: 'id',
  },
};

const modelName = 'Patient';

const auxModels = {};

function createTableName(fieldName) {
  return `${modelName}-${fieldName}`;
}

function createPrimaryKey(dependencies, fieldName) {
  return dependencies.length ?
    `${fieldName}.${dependencies.join('.')}` :
    fieldName;
}

function createAuxilliaryTables() {
  each(auxilliaryConfig, (config, fieldName) => {
    const {
      value,
      dependencies = [],
    } = config;

    const tableName = createTableName(fieldName);
    const primaryKey = createPrimaryKey(dependencies, fieldName);

    // mimics adding models to some in-mem store that we can access
    auxModels[tableName] = {};

    console.log(`Created Auxilliary Table: ${tableName}`);
    console.log(`Primary Key: ${primaryKey}`);
    console.log(`Value: ${modelName}.${value}`);
  });
}

createAuxilliaryTables();

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
