/**
 * Module to provide Batch Creation functionality for a Sequelize Model
 * Created by gavin on 2017-09-09.
 */

/**
 * Creates a json-api compliant error object, with an extra
 * model field for convenience
 * @param err - Error object
 * @param model - Model on which this error occurred
 * @returns {[*]}
 */
function buildErrors(err, model) {
  // Create a JsonAPI error object. If a collection of errors exists, multiple error
  // objects are created.
  let errors = [{ status: 500, title: err.name, detail: err.message, model }];
  if (err.errors) {
    errors = err.errors.map((error) => {
      let errorPointer = '/';
      if (error.path) {
        errorPointer = `/data/attributes/${error.path}`;
      }

      return {
        status: 500,
        source: {
          pointer: errorPointer,
        },
        title: error.type,
        detail: error.message,
        model,
      };
    });
  }

  return errors;
}

/**
 * Validates the dataArray, return a list of both errors, as well as valid models
 * @param dataArray - List of model data to build models from
 * @param Model - Sequelize Model
 * @returns {Promise.<{errors: Array, docs: Array}>}
 */
async function preValidate(dataArray, Model) {
  const errors = [];

  // Build instances of the models
  const docs = dataArray.map(p => Model.build(p));

  // Now Do ORM Validation
  const validatedDocs = [];
  for (const d of docs) {
    try {
      await d.validate(); // validate against schema
      validatedDocs.push(d);
    } catch (err) {
      errors.push(buildErrors(err, d));
    }
  }

  return { errors, docs: validatedDocs };
}

/**
 * Batch Saves models, validating them beforehand
 * @param dataArray - List of model data to build models from
 * @param Model - Sequelize Model
 * @param modelType - Type of the model. Ex: 'Appointment'
 * @returns {Promise.<*>}
 */
async function batchCreate(dataArray, Model, modelType) {
  const { docs, errors } = await preValidate(dataArray, Model);
  const savableCopies = docs.map(d => d.get({ plain: true }));
  const response = await Model.bulkCreate(savableCopies);
  if (errors.length) {
    const errorsResponse = errors.map((error) => {
      error.model = modelType;
      error.errorMessage = `${modelType} save error`;
      if (error.errors && error.errors[0]) {
        error.errorMessage = error.errors[0].message;
      }
      return error;
    });

    throw { docs: response, errors: errorsResponse };
  }

  return response;
}

module.exports = {
  batchCreate,
};
