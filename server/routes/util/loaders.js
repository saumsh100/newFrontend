
// const models = require('../../models');
const _models = require('../../_models');
const StatusError = require('../../util/StatusError');

/*module.exports = (reqProp, modelName, joinData = {}) => {
  return (req, res, next, param) => {
    models[modelName].get(param).getJoin(joinData).run()
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
};*/

module.exports.sequelizeLoader = (reqProp, modelName, include = []) => {
  return (req, res, next, param) => {
    _models[modelName].findOne({ where: { id: param }, include })
      .then((model) => {
        if (!model) next(StatusError(404, `${modelName} with id=${param} not found`));

        // Set req[reqProp] to the fetched model and go onto next middleware
        req[reqProp] = model;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(StatusError(404, `${modelName} with id=${param} could not be loaded `));
      });
  };
};

/*module.exports = (reqProp, modelName, joinData) => {
  return (req, res, next, param) => {
    let query = models[modelName].get(param);
    if (joinData) {
      query = query.getJoin(joinData);
    }

    query.run()
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
};*/
