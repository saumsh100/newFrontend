
const models = require('../../models');
const StatusError = require('../../util/StatusError');

const { User } = models;

module.exports = (reqProp) => {
  return (req, res, next, param) => {
    User.get(param).run()
      .then((user) => {
        if (!user) StatusError(404, 'User not found');
        
        // Set req[reqProp] to the fetched user and go onto next middleware
        req[reqProp] = user;
        next();
      })
      .catch((err) => {
        next(StatusError(404, 'User not found'));
      });
  };
};
