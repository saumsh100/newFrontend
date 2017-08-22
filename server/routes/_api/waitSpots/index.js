
import { Router } from 'express';
import moment from 'moment';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { WaitSpot } from '../../../_models';
import globals, { namespaces } from '../../../config/globals';

const waitSpotsRouter = Router();

waitSpotsRouter.param('waitSpotId', sequelizeLoader('waitSpot', 'WaitSpot'));

/**
 * Create a waitSpot
 */
waitSpotsRouter.post('/', (req, res, next) => {
  // Attach chair to the clinic of posting user
  // TODO: the short circuit is here to support widget, NEEDS to be removed!
  const accountId = req.body.accountId || req.accountId;
  const waitSpotData = Object.assign({}, req.body, {
    accountId,
  });

  return WaitSpot.create(waitSpotData)
    .then((waitSpot) => {
      res.status(201).send(normalize('waitSpot', waitSpot.dataValues));
      return waitSpot;
    }).then((waitSpot) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('create:WaitSpot', normalize('waitSpot', waitSpot.get({ plain: true })));
    })
    .catch(next);
});

/**
 * Get all waitSpots under a clinic
 */
waitSpotsRouter.get('/', async (req, res, next) => {
  const { accountId, includeArray, query } = req;

  let {
    startTime,
    endTime,
  } = query;

  startTime = startTime ? startTime : moment().startOf('day').toISOString();
  endTime = endTime ? endTime : moment().add(1, 'years').toISOString();

  try {
    const waitSpots = await WaitSpot.findAll({
      raw: true,
      nest: true,
      where: {
        accountId,
        endDate: {
          $lte: endTime,
          $gte: startTime,
        },
      },
      include: includeArray,
    });
    res.send(normalize('waitSpots', waitSpots));
  } catch (error) {
    next(error);
  }
});

/**
 * Get a waitSpots
 */
/*
waitSpotsRouter.get('/:waitSpotId', checkPermissions('waitSpots:read'), (req, res, next) => {
  return Promise.resolve(req.waitSpot)
    .then(waitSpot => res.send(normalize('waitSpot', waitSpot)))
    .catch(next);
});*/

/**
 * Update a waitSpot
 */
waitSpotsRouter.put('/:waitSpotId', checkPermissions('waitSpots:update'), (req, res, next) => {
  const accountId = req.body.accountId || req.accountId;

  return req.waitSpot.update(req.body)
    .then((waitSpot) => {
      res.send(normalize('waitSpot', waitSpot.dataValues));
      return waitSpot;
    }).then((waitSpot) => {
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('update:WaitSpot', normalize('waitSpot', waitSpot.get({ plain: true })));
    })
    .catch(next);
});

/**
 * Delete a waitSpot
 */
waitSpotsRouter.delete('/:waitSpotId', checkPermissions('waitSpots:delete'), (req, res, next) => {
  const { waitSpot, accountId } = req;
  // We actually delete waitSpots as we don't care about history
  return req.waitSpot.destroy()
    .then(() => {
      res.status(204).send();
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      return io.of(ns).in(accountId).emit('remove:WaitSpot', waitSpot.id);
    })
    .catch(next);
});

module.exports = waitSpotsRouter;
