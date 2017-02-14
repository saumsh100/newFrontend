
const models = require('../../models');
const StatusError = require('../../util/StatusError');

module.exports = (reqProp, modelName) => {
  return (req, res, next, param) => {
    models[modelName].get(param).run()
      .then((model) => {
        if (!model) next(StatusError(404, `${modelName} with id=${param} not found`));
        
        // Set req[reqProp] to the fetched model and go onto next middleware
        req[reqProp] = model;
        next();
      })
      .catch((err) => {
        next(StatusError(404, `${modelName} with id=${param} not found`));
      });
  };
};
