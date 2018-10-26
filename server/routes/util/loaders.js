
const models = require('../../_models');
const StatusError = require('../../util/StatusError');

module.exports.sequelizeLoader = (reqProp, modelName, include = []) => (req, res, next, param) => {
  models[modelName].findOne({
    where: { id: param },
    include,
  }).then((model) => {
    if (!model) next(StatusError(StatusError.NOT_FOUND, `${modelName} with id=${param} not found`));
    // Set req[reqProp] to the fetched model and go onto next middleware
    req[reqProp] = model;
    next();
  }).catch((err) => {
    console.error(err);
    next(StatusError(StatusError.INTERNAL_SERVER_ERROR, `${modelName} with id=${param} could not be loaded `));
  });
};
