
const requestsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Request = require('../../../models/Request');

/**
 * Get all requests
 */
requestsRouter.get('/', checkPermissions('requests:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  return Request.filter({ accountId }).getJoin(joinObject).run()
    .then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

module.exports = requestsRouter;
