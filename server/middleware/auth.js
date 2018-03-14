
import jwt from 'jsonwebtoken';
import merge from 'lodash/merge';
import { tokenSecret } from '../config/globals';
import rolePermissions from '../config/permissions';
import StatusError from '../util/StatusError';
import { AuthSession as _AuthSession } from '../_models';

function getTokenFromReq(req) {
  if (!req.headers || !req.headers.authorization) {
    return false;
  }

  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }

  return false;
}

module.exports.sequelizeAuthMiddleware = function (req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    return next(StatusError(401, 'Unauthorized. No valid token on header.'));
  }

  // Try decoding token
  // TODO: eventually we need to remove this decoding step, it's unnecessary
  try {
    jwt.decode(token, { complete: true });
  } catch (err) {
    return next(StatusError(401, 'Unauthorized. Could not decode token.'));
  }

  return jwt.verify(token, tokenSecret, {}, (err, decoded) => {
    if (err) {
      console.error(err);
      return next(StatusError(401, 'Unauthorized. Error verifying token.'));
    }

    // We use this for activeAccountId and userId to allow controllers to fetch appropriate data
    req.token = token;
    req.decodedToken = decoded;
    req.sessionId = decoded.sessionId;

    const checkValidity = (message = '') => value =>
      (value || Promise.reject(StatusError(401, `Unauthorized. ${message}`)));

    // Load Session
    _AuthSession.findById(decoded.sessionId)
      .then(checkValidity('Session Token not found.'))
      .then(({ modelId: userId, permissions, role, enterpriseId, accountId, permissionId }) => {
        const mergedPermissions = merge({}, rolePermissions[role], permissions);
        const sessionData = {
          userId,
          permissions: mergedPermissions,
          role,
          permissionId,
          enterpriseId,
          accountId,
        };

        Object.assign(req, sessionData);
        req.sessionData = sessionData;
      })
      // TODO: Check is token expired
      .catch((e) => {
        const error = (e.name === 'DocumentNotFoundError' ?
            StatusError(401, 'Unauthorized.') :
            e
        );

        next(error);
      })
      // Done
      .then(next)
      .catch(next);
  });
};
