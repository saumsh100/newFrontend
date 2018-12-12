
import { merge, sortAsc } from '@carecru/isomorphic';

/**
 * queryIncludeMerger
 *
 * Custom merger for the include array of the query object
 * Takes a include array and returns a new array with equal model includes in the same object
 * This way we can build N number of different filters for the same join object in one single query
 * @param includeArray
 * @returns {Array} Array of merged models
 * @throws {Error} if model has incorrect format
 */
export default (includeArray) => {
  if (includeArray.length === 1) {
    errorHandler(includeArray[0]);
    return includeArray;
  }

  return includeArray.sort(({ as: a }, { as: b }) => sortAsc(a, b))
    .reduce((acc, model, i, arr) => {
      errorHandler(model);
      const mergedModel = needsMerging(model, i, arr)
        ? merge.all([
          acc.pop(),
          model,
        ])
        : model;

      acc.push(mergedModel);
      return acc;
    }, []);
};

/**
 * errorHandler
 * @param {Object} model
 * @throws {Error} if the model is not a object or doesn't contain the as attribute
 */
const errorHandler = (model) => {
  if (typeof model !== 'object') {
    throw new Error('Argument should be an array of include objects');
  }

  if (!model.as) {
    throw new Error('Include objects should have "as" attribute');
  }
};

/**
 * needsMerging
 * Checking if the model should be merged with the previous during the reduce iteration
 * @param {Object} model
 * @param {int} index
 * @param {Array} array
 * @returns {boolean}
 */
const needsMerging = (model, index, array) => index > 0 && array[index - 1].as === model.as;
