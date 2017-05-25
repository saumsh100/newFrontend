
const waitSpotsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const WaitSpot = require('../../../models/WaitSpot');

waitSpotsRouter.param('waitSpotId', loaders('waitSpot', 'WaitSpot'));

/**
 * Create a waitSpot
 */
waitSpotsRouter.post('/', (req, res, next) => {
  // Attach chair to the clinic of posting user
  /*const chairData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });*/

  return WaitSpot.save(req.body)
    .then(waitSpot => res.send(201, normalize('waitSpot', waitSpot)))
    .catch(next);
});

/**
 * Get all waitSpots under a clinic
 */
waitSpotsRouter.get('/', (req, res, next) => {
  const { accountId, joinObject } = req;

  // There is no joinData for waitSpot, no need to put...
  return WaitSpot.filter({ accountId }).getJoin(joinObject).run()
    .then(waitSpots => res.send(normalize('waitSpots', waitSpots)))
    .catch(next);
});

/**
 * Get a waitSpots
 */
waitSpotsRouter.get('/:waitSpotId', checkPermissions('waitSpots:read'), (req, res, next) => {
  return Promise.resolve(req.waitSpot)
    .then(waitSpot => res.send(normalize('waitSpot', waitSpot)))
    .catch(next);
});

/**
 * Update a waitSpot
 */
waitSpotsRouter.put('/:waitSpotId', checkPermissions('waitSpots:update'), (req, res, next) => {
  return req.waitSpot.merge(req.body).save()
    .then(waitSpot => res.send(normalize('waitSpot', waitSpot)))
    .catch(next);
});

/**
 * Delete a waitSpot
 */
waitSpotsRouter.delete('/:waitSpotId', checkPermissions('waitSpots:delete'), (req, res, next) => {
  // We actually delete waitSpots as we don't care about history
  return req.waitSpot.delete()
    .then(() => res.send(204))
    .catch(next);
});

module.exports = waitSpotsRouter;
