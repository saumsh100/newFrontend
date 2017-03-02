
const jwt = require('jsonwebtoken');
const globals = require('../config/globals');
const StatusError = require('../util/StatusError');

const CRUD = {
  create: true,
  read: true,
  update: true,
  delete: true,
};

const OWNER = {
  accounts: CRUD,
  appointments: CRUD,
  chairs: CRUD,
  chats: CRUD,

  listings: {
    read: true,
  },

  patients: CRUD,
  practitioners: CRUD,
  requests: CRUD,
  reviews: {
    read: true,
  },

  textMessages: Object.assign({}, CRUD, {
    update: false,
  }),

};

const ADMIN = Object.assign({}, OWNER, {

});

const USER = Object.assign({}, ADMIN, {

});

const permissions = {
  // Account Types
  OWNER,
  ADMIN,
  USER,
};

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

  return jwt.verify(token, globals.tokenSecret, {}, (err, decoded) => {
    if (err) {
      return next(StatusError(401, 'Unauthorized. Error verifying token.'));
    }

    // We use this for activeAccountId and userId to allow controllers to fetch appropriate data
    req.token = token;
    req.decodedToken = decoded;
    req.accountId = decoded.activeAccountId;

    // Pull in the role's permissions and extend the extra permissions ontop
    req.permissions = Object.assign({}, permissions[decoded.role], decoded.permissions);
    return next();
  });
};
