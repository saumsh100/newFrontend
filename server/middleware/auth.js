
import jwt from 'jsonwebtoken';
import { tokenSecret } from '../config/globals';
import permissions from '../config/permissions';
import StatusError from '../util/StatusError';

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

module.exports = function authMiddleware(req, res, next) {
  const hostname = req.hostname;
  const token = getTokenFromReq(req);
  if (!token) {
    return next(StatusError(401, 'Unauthorized. No valid token on header.'));
  }

  // Try decoding token
  try {
    jwt.decode(token, { complete: true }) || {};
  } catch (err) {
    return next(StatusError(401, 'Unauthorized. Could not decode token.'));
  }

  return jwt.verify(token, tokenSecret, {}, (err, decoded) => {
    if (err) {
      return next(StatusError(401, 'Unauthorized. Error verifying token.'));
    }

    // We use this for activeAccountId and userId to allow controllers to fetch appropriate data
    req.token = token;
    req.decodedToken = decoded;
    req.accountId = decoded.activeAccountId;
    req.role = decoded.role;
    // Pull in the role's permissions and extend the extra permissions ontop
    req.permissions = { ...permissions[decoded.role], ...decoded.permissions };
    return next();
  });
};
