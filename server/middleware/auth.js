
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { tokenSecret } from '../config/globals';
import permissions from '../config/permissions';
import StatusError from '../util/StatusError';
import { AuthToken, User, Permission } from '../models';

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
  const token = getTokenFromReq(req);
  if (!token) {
    return next(StatusError(401, 'Unauthorized. No valid token on header.'));
  }

  // Try decoding token
  try {
    jwt.decode(token, { complete: true });
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
    req.tokenId = decoded.tokenId;

    const loadPermissions = (userId, accountId) =>
      Permission.filter({ userId, accountId }).run()
        .then(([permission]) => permission || Promise.reject(StatusError(500, 'User has no account permissions')));

    const getEmailDomain = email => (([, domain]) => domain)(/@(.+)$/.exec(email));
    const isCarecruEmail = email => getEmailDomain(email) === 'carecru.com';

    const checkValidity = (message = '') => value =>
      (value || Promise.reject(StatusError(401, `Unauthorized. ${message}`)));

    // Load Token
    AuthToken.get(decoded.tokenId).run()
      .then(checkValidity('Token not found.'))
      .then((authToken) => { req.authToken = authToken; })

      // TODO: Check is token expired

      // Load User
      .then(() => User.get(decoded.userId).run())
      .then(checkValidity('User not found'))
      .then((currentUser) => { req.currentUser = currentUser; })

      // Set Account ID
      .then(() => (req.authToken.accountId || req.currentUser.activeAccountId))
      .then((accountId) => { req.accountId = accountId; })

      // Load Permissions
      .then(() => loadPermissions(req.currentUser.id, req.accountId))
      .then(({ role, userPermissions = {} }) => {
        req.role = isCarecruEmail(req.currentUser.username) ? 'SUPERADMIN' : role;
        req.permissions = { ...permissions[role], ...userPermissions };
      })

      // Done
      .then(next)
      .catch(next);
  });
};
