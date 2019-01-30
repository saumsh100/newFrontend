import { sequelize } from '../../_models';

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
  if (!err.errors || !Array.isArray(err.errors)) {
    return [{ status: 500, title: err.name, detail: err.message, model }];
  }

  return err.errors.map((error) => {
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

/**
 * Validates the dataArray, return a list of both errors, as well as valid models
 * @param dataArray - List of model data to build models from
 * @param Model - Sequelize Model
 * @param extraSetValidators - Validators to filter entire set. Must return { validDocs, errs }
 * @param extraModelValidators - Validators run against each model. Must throw any errors, else
 * return the model passed in.
 * @returns {Promise.<{errors: Array, docs: Array}>}
 */
async function preValidate(dataArray, Model, extraSetValidators = [], extraModelValidators = []) {
  const errors = [];
  const docs = dataArray.map(p => {
    const model = Model.build(p);

    model.request = p;
    return model;
  });

  // Now Do ORM Validation
  let validatedDocs = [];
  for (const d of docs) {
    try {
      await d.validate(); // validate against schema
      validatedDocs.push(d);
    } catch (err) {
      console.error(err);
      errors.push(buildErrors(err, d));
    }
  }

  // Run any extra set validators
  for (const validator of extraSetValidators) {
    const { validDocs, errs } = await validator(validatedDocs);
    validatedDocs = validDocs;
    for (const err of errs) {
      errors.push(err);
    }
  }

  // Run any extra model validators
  for (const validator of extraModelValidators) {
    const filteredValidatedDocs = [];
    for (const d of validatedDocs) {
      try {
        await validator(d);
        filteredValidatedDocs.push(d);
      } catch (err) {
        errors.push(buildErrors(err, d));
      }
    }

    validatedDocs = filteredValidatedDocs;
  }

  return { errors, docs: validatedDocs };
}

export function batchDelete(ids, Model) {
  const length = ids.length;

  return sequelize.transaction(async (t) => {
    try {
      await Model.destroy({
        where: {
          id: ids,
        },
        transaction: t,
      });

      let affectedRows = await Model.findAndCountAll({
        where: {
          id: ids,
        },
        paranoid: false,
      });

      affectedRows = affectedRows.count;

      if (affectedRows !== length) {
        throw "Didn't delete the right number of rows so deleted none";
      }

      return affectedRows;
    } catch (e) {
      throw e;
    }
  });
}

/**
 * [batchUpdate description]
 * @param  {[object]} dataArray           values to change
 * @param  {[object]} Model               [Model of the values]
 * @param  {[string]} modelType           [model name]
 * @param  {[function]} preUpdateFunction [a function to be called before the update]
 * @return {[object]}                     [object of saved models and any errors (if any)]
 */
export async function batchUpdate(dataArray, Model, modelType, preUpdateFunction) {
  const savedModels = [];
  const errors = [];

  for (let i = 0; i < dataArray.length; i += 1) {
    try {
      const model = await Model.findOne({
        where: {
          id: dataArray[i].id,
        },
      });


      if (preUpdateFunction) {
        preUpdateFunction(model, dataArray[i]);
      }
      const savedModel = await model.update(dataArray[i]);

      savedModels.push(savedModel);
    } catch (e) {
      errors.push(e);
    }
  }

  if (errors.length) {
    throw { docs: savedModels, errors };
  }

  return savedModels;
}

/**
 * Batch Saves models, validating them beforehand
 * @param dataArray - List of model data to build models from
 * @param Model - Sequelize Model
 * @param modelType - Type of the model. Ex: 'Appointment'
 * @param extraSetValidators - Validators to filter entire set. Must return { validDocs, errs }
 * @param extraModelValidators - Validators run against each model. Must throw any errors, else
 * return the model passed in.
 * @returns {Promise.<*>}
 */
async function batchCreate(dataArray, Model, modelType, extraSetValidators = [],
                           extraModelValidators = [], postCreate) {
  const { docs, errors } = await preValidate(
    dataArray,
    Model,
    extraSetValidators,
    extraModelValidators,
  );

  const savableCopies = docs.map(d => d.get({ plain: true }));

  const response = await Model.bulkCreate(savableCopies).catch((e) => {
    if (modelType === 'deliveredProcedure') {
      return console.log('Batch Failed for deliveredProcedure');
    }
    return console.log(e);
  });

  if (postCreate) {
    await postCreate(docs);
  }

  if (errors.length) {
    const errorsResponse = errors.map((error) => {
      if (error.length === 1 && typeof error[0].detail === 'object'
        && (error[0].detail.messages === 'AccountId PMS ID Violation' ||
          error[0].detail.messages === 'PractitionerId PMS ID Violation')) {
        response.push(error[0].detail.model);
      }

      error.model = modelType;
      error.errorMessage = `${modelType} save error`;

      if (error.errors && error.errors[0]) {
        error.errorMessage = error.errors[0].message;
      }

      return error;
    });

    throw { docs: response || [], errors: errorsResponse };
  }

  return response;
}

export default batchCreate;
