const StatusError = require('../util/StatusError');

module.exports = function checkPermission(permission) {
  // permission = 'listings:read'
  permission = permission.split(':');
  const entity = permission[0];
  const action = permission[1];
  return function middleware(req, res, next) {
    console.log(req.permissions);
    if (req.permissions[entity] && req.permissions[entity][action]) {
      return next();
    }

    return next(StatusError(403, `Requesting user does not have ${action} permission for ${entity}.`));
  };
};
