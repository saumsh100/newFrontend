const jwt = require('jsonwebtoken');
const merge = require('lodash/merge')

const permissions = {
  OWNER: {
    accounts: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    listings: {
       read: true,
    },
    reviews: {
       read: true,
    },
  },
  ADMIN: {
    accounts: {
      create: true,
      read: true,
      update: true,
    },
    listings: {
       read: true,
    },
    reviews: {
       read: true,
    },
  },
  VIEWER: {
    account: {
      read: true,
    }
  }
}
// const authMiddleware = jwt({ secret: 'notsosecret' });

function getTokenFromReq (req) {
  if (!req.headers || !req.headers.authorization) {
    return false;
  }
  var parts = req.headers.authorization.split(' ');
  if (parts.length == 2) {
    var scheme = parts[0];
    var credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
}

module.exports = function (req, res, next) {
  const token = getTokenFromReq(req)
  if (!token) {
    return next({status: 401})
  }

  var dtoken;

  try {
    dtoken = jwt.decode(token, { complete: true }) || {};
  } catch (err) {
    return next({status: 401});
  }

  return jwt.verify(token, 'notsosecret', {}, function(err, decoded) {
    if (err) {
      return next({status:401});
    } 
    req.user = decoded.user
    req.permissions = merge({}, permissions[decoded.role], decoded.permissions)

    return next()
  });

}