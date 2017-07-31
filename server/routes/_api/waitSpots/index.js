
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { WaitSpot } from '../../../_models';
import moment from 'moment';

const waitSpotsRouter = Router();

waitSpotsRouter.param('waitSpotId', sequelizeLoader('waitSpot', 'WaitSpot'));

/**
 * Create a waitSpot
 */
waitSpotsRouter.post('/', checkPermissions('waitSpots:create'), (req, res, next) => {
  // Attach chair to the clinic of posting user
  // TODO: the short circuit is here to support widget, NEEDS to be removed!
  const waitSpotData = Object.assign({}, req.body, {
    accountId: req.body.accountId || req.accountId,
  });

  return WaitSpot.create(waitSpotData)
    .then(waitSpot => res.send(201, normalize('waitSpot', waitSpot.dataValues)))
    .catch(next);
});

/**
 * Get all waitSpots under a clinic
 */
waitSpotsRouter.get('/', checkPermissions('waitSpots:read'), async (req, res, next) => {
  const { accountId, joinObject, query } = req;

  let {
    startTime,
    endTime,
  } = query;

  startTime = startTime ? startTime : moment().toISOString();
  endTime = endTime ? endTime : moment().add(1, 'years').toISOString();

  try {
    const waitSpots = await WaitSpot.findAll({
      raw: true,
      where: {
        accountId,
        endDate: {
          $lte: endTime,
          $gte: startTime,
        },
      },
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
  return req.waitSpot.update(req.body)
    .then(waitSpot => res.send(normalize('waitSpot', waitSpot.dataValues)))
    .catch(next);
});

/**
 * Delete a waitSpot
 */
waitSpotsRouter.delete('/:waitSpotId', checkPermissions('waitSpots:delete'), (req, res, next) => {
  // We actually delete waitSpots as we don't care about history
  return req.waitSpot.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});

module.exports = waitSpotsRouter;
