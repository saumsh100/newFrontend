
const _ = require('lodash');
const StatusError = require('../util/StatusError');

module.exports = function checkIsArray(key) {
  return function checkIsArrayMiddleware(req, res, next) {
    const set = req.body[key];
    if (_.isArray(set)) {
      return next();
    }

    return next(StatusError(500, `${key} attribute in req.body must be an array`));
  };
};
