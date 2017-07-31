
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Chair } from '../../../_models';

const chairsRouter = Router();

chairsRouter.param('chairId', sequelizeLoader('chair', 'Chair'));

/**
 * POST /
 *
 * - Create a chair
 */
chairsRouter.post('/', checkPermissions('chairs:create'), (req, res, next) => {
  // Attach chair to the clinic of posting user
  const chairData = Object.assign({}, req.body, {
    accountId: req.accountId || req.body.accountId,
  });

  return Chair.create(chairData)
    .then(chair => res.status(201).send(normalize('chair', chair.dataValues)))
    .catch(next);
});

/**
 * GET /
 *
 * - Get all chairs in an account
 */
chairsRouter.get('/', checkPermissions('chairs:read'), async (req, res, next) => {
  const { accountId } = req;
  try {
    const chairs = await Chair.findAll({
      raw: true,
      // TODO: add this back when we have auth back
      where: { accountId },
    });

    res.send(normalize('chairs', chairs));
  } catch (error) {
    next(error);
  }
});

/**
 * Get a chair
 */
chairsRouter.get('/:chairId', checkPermissions('chairs:read'), (req, res, next) => {
  return Promise.resolve(req.chair)
    .then(chair => res.send(normalize('chair', chair.dataValues)))
    .catch(next);
});

/**
 * Update a chair
 */
chairsRouter.put('/:chairId', checkPermissions('chairs:update'), (req, res, next) => {
  return req.chair.update(req.body)
    .then(chair => res.send(normalize('chair', chair.dataValues)))
    .catch(next);
});

/**
 * Delete a chair
 */
chairsRouter.delete('/:chairId', checkPermissions('chairs:delete'), (req, res, next) => {
  // TODO: probably need to make sure we purge all other areas where chairId is used
  // We actually delete chairs as we don't care about history
  return req.chair.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});

module.exports = chairsRouter;
