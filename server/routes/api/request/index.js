
const requestsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Request = require('../../../models/Request');

requestsRouter.param('requestId', loaders('request', 'Request'));

/**
 * Create a request
 */
requestsRouter.post('/', checkPermissions('requests:create'), (req, res, next) => {

  /**
   * If you are using postman to send in new requests then this won't work.
  const requestData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });*/

  return Request.save(req.body)
    .then(request => res.send(201, normalize('request', request)))
    .catch(next);
});

/**
 * Get all requests
 */
requestsRouter.get('/', checkPermissions('requests:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  return Request.filter({ accountId, isCancelled: false }).getJoin(joinObject).run()
    .then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

/**
 * Update a request
 */
requestsRouter.put('/:requestId', checkPermissions('requests:update'), (req, res, next) =>{
  return req.request.merge(req.body).save()
    .then(request => res.send(normalize('request', request)))
    .catch(next);
});

/**
 * Delete a request
 */
requestsRouter.delete('/:requestId', checkPermissions('requests:delete'), (req, res, next) =>{
  return req.request.delete()
    .then(() =>{
        res.send(204);
    })
    .catch(next);
});

module.exports = requestsRouter;
