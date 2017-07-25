
const waitSpotsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const { r } = require('../../../config/thinky');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const WaitSpot = require('../../../models/WaitSpot');
const Patient = require('../../../models/Patient');
const moment = require('moment');
const { namespaces } = require('../../../config/globals');


waitSpotsRouter.param('waitSpotId', loaders('waitSpot', 'WaitSpot'));

/**
 * Create a waitSpot
 */
waitSpotsRouter.post('/', (req, res, next) => {
  // Attach chair to the clinic of posting user
  // TODO: the short circuit is here to suppor widget, NEEDS to be removed!

  const accountId = req.body.accountId || req.accountId;
  const waitSpotData = Object.assign({}, req.body, {
    accountId,
  });

  return WaitSpot.save(waitSpotData)
    .then((waitSpot) => {
      const normalized = normalize('waitSpot', waitSpot);
      res.send(201, normalized);
      return { waitSpot, normalized };
    })
    .then(async ({ waitSpot, normalized }) => {

      if (waitSpot.patientId) {
        waitSpot.patient = await Patient.get(waitSpot.patientId);
      }

      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('create:WaitSpot', normalize('waitSpot', waitSpot));
    })
    .catch(next);
});

/**
 * Get all waitSpots under a clinic
 */
waitSpotsRouter.get('/', (req, res, next) => {
  const { accountId, joinObject, query } = req;

  let {
    startTime,
    endTime,
  } = query;

  startTime = startTime ? r.ISO8601(startTime) : r.now();
  endTime = endTime ? r.ISO8601(endTime) : r.now().add(365 * 24 * 60 * 60);

  return WaitSpot
    .filter({ accountId })
    .filter(r.row('endDate').during(startTime, endTime))
    .getJoin(joinObject)
    .run()
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
  const accountId = req.body.accountId || req.accountId;

  return req.waitSpot.merge(req.body).save()
    .then((waitSpot) => {
      const normalized = normalize('waitSpot', waitSpot);
      res.send(201, normalized);
      return { normalized };
    })
    .then(({ normalized }) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('update:WaitSpot', normalized);
    })
    .catch(next);
});

/**
 * Delete a waitSpot
 */
waitSpotsRouter.delete('/:waitSpotId', checkPermissions('waitSpots:delete'), (req, res, next) => {
  // We actually delete waitSpots as we don't care about history

  const { waitSpot, accountId } = req;

  return req.waitSpot.delete()
    .then(() => res.send(204))
    .then(() => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('remove:WaitSpot', waitSpot.id);
    })
    .catch(next);
});

module.exports = waitSpotsRouter;
