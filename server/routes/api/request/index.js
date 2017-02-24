const _ = require('lodash');
const requestsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Request = require('../../../models/Request');
const Service = require('../../../models/Service');
const moment = require('moment');

requestsRouter.param('requestId', loaders('request', 'Request'));

/**
 * Create a request
 */
requestsRouter.post('/', checkPermissions('requests:create'), (req, res, next) => {
  const { serviceId, startTime } = req.body;
  Service.get(serviceId).run().then((service) => {
    const serviceDuration = service.duration;
    const endTime = moment(startTime).add(serviceDuration ,'minutes')._d;
    const requestData = Object.assign({}, req.body, {
      accountId: req.accountId,
      endTime,
    });
    return Request.save(requestData)
      .then(request => res.send(201, normalize('request', request)))
      .catch(next);
  });
});

/**
 * Get all requests
 */
requestsRouter.get('/', checkPermissions('requests:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  const isCancelledQuery = req.query && req.query.isCancelled;
  const filter = { accountId };
  if (isCancelledQuery) {
    if (isCancelledQuery === 'true') {
      filter.isCancelled = true;
    } else if (isCancelledQuery) {
      filter.isCancelled = false;
    }
  }

  return Request.filter(filter).getJoin(joinObject).run()
    .then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

/**
 * Update a request
 */
requestsRouter.put('/:requestId', checkPermissions('requests:update'), (req, res, next) => {
  const updatedReq = _.omit(req.body, ['id', 'createdAt']);
  return req.request.merge(updatedReq).save()
    .then(request => res.send(normalize('request', request)))
    .catch(next);
});

/**
 * Delete a request
 */
requestsRouter.delete('/:requestId', checkPermissions('requests:delete'), (req, res, next) => {
  return req.request.delete()
    .then(() => {
      res.send(204);
    })
    .catch(next);
});

module.exports = requestsRouter;
