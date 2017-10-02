
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import format from '../../util/format';
import { Chair } from '../../../_models';

const chairsRouter = Router();

chairsRouter.param('chairId', sequelizeLoader('chair', 'Chair'));



/**
 * POST /
 *
 * - Create a chair
 */
chairsRouter.post('/', checkPermissions('chairs:create'), async (req, res, next) => {
  // Attach chair to the clinic of posting user
  const chairData = Object.assign({}, req.body, {
    accountId: req.accountId || req.body.accountId,
  });

  try {
    const chairTest = await Chair.build(chairData);
    await chairTest.validate();

    return Chair.create(chairData)
        .then(chair => res.status(201).send(format(req, res, 'chair', chair.get({ plain: true }))))
        .catch(next);
  } catch (e) {
    if (e.errors[0] && e.errors[0].message.messages === 'AccountId PMS ID Violation') {
      const chair = e.errors[0].message.model.dataValues;

      const normalized = format(req, res, 'chair', chair);
      return res.status(201).send(normalized);
    }
    return next(e);
  }
});

/**
 * GET /
 *
 * - Get all chairs in an account
 */
chairsRouter.get('/', checkPermissions('chairs:read'), async (req, res, next) => {
  try {
    const { accountId } = req;
    const chairs = await Chair.findAll({
      raw: true,
      // TODO: add this back when we have auth back
      where: { accountId },
      order: [
        ['name', 'DESC'],
      ],
    });

    res.send(format(req, res, 'chairs', chairs));
  } catch (error) {
    next(error);
  }
});

/**
 * Get a chair
 */
chairsRouter.get('/:chairId', checkPermissions('chairs:read'), (req, res, next) => {
  return Promise.resolve(req.chair)
    .then(chair => res.send(format(req, res, 'chair', chair.get({ plain: true }))))
    .catch(next);
});

/**
 * Update a chair
 */
chairsRouter.put('/:chairId', checkPermissions('chairs:update'), (req, res, next) => {
  return req.chair.update(req.body)
    .then(chair => res.send(format(req, res, 'chair', chair.get({ plain: true }))))
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
