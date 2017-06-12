import jwt from 'jsonwebtoken';
import { tokenSecret } from '../config/globals';
import StatusError from '../util/StatusError';
import { AuthSession } from '../models';

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
  // TODO: eventually we need to remove this decoding step, it's unnecessary
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

    const checkValidity = (message = '') => value =>
      (value || Promise.reject(StatusError(401, `Unauthorized. ${message}`)));

    // Load Token
    AuthSession.get(decoded.tokenId).run()
      .then(checkValidity('Session Token not found.'))
      .then(({ modelId: userId, permissions, role, enterpriseId, accountId }) => {
        const sessionData = {
          userId,
          permissions,
          role,
          enterpriseId,
          accountId,
        };

        Object.assign(req, sessionData);
        req.sessionData = sessionData;
      })

      // TODO: Check is token expired
      .catch(e =>
        (e.name === 'DocumentNotFoundError' ?
            StatusError(401, 'Unauthorized.') :
            e
        )
      )

      // Done
      .then(next)
      .catch(next);
  });
};
