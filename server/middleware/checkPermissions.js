
import isArray from 'lodash/isArray';
import StatusError from '../util/StatusError';

module.exports = function checkPermission(permission) {
  // Normalize to array
  const requests = (isArray(permission) ? permission : [permission])
    // Split each permission request
    .map(request => request.split(':'));

  // All requests should be passed
  const check = permissions =>
    requests.reduce((res, [resource, action]) =>
      res && (permissions[resource] && permissions[resource][action]), true);
  return function middleware(req, res, next) {
    if (check(req.permissions)) {
      return next();
    }

    return next(StatusError(403, 'The user does not have permission to perform this action.'));
  };
};
