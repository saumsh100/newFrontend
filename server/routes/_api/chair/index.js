
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import loaders from '../../util/loaders';
import normalize from '../normalize';
import { Chair } from '../../../_models';

const chairsRouter = Router();

chairsRouter.param('chairId', loaders('chair', 'Chair'));

/**
 * POST /
 *
 * - Create a chair
 */
chairsRouter.post('/', checkPermissions('chairs:create'), (req, res, next) => {
  // Attach chair to the clinic of posting user
  const chairData = Object.assign({}, req.body, {
    accountId: req.accountId,
    name: req.body.name,
    pmsId: req.body.pmsId,
  });

  return Chair.save(chairData)
    .then(chair => res.status(201).send(normalize('chair', chair)))
    .catch(next);
});

/**
 * GET /
 *
 * - Get all chairs in an account
 */
chairsRouter.get('/', /*checkPermissions('chairs:read'),*/ async (req, res, next) => {
  /*const { accountId } = req;

  // There is no joinData for chair, no need to put...
  return Chair.filter({ accountId }).run()
    .then(chairs => res.send(normalize('chairs', chairs)))
    .catch(next);*/
  try {
    // Find all segments existing on system. Temporary for showing functionality
    const chairs = await Chair.findAll();
    console.log(chairs);
    // res.send(segments);
    res.send({ test: '123' });
  } catch (error) {
    console.log(error);
    next(error);
  }

});

/**
 * Get a chair
 */
chairsRouter.get('/:chairId', checkPermissions('chairs:read'), (req, res, next) => {
  return Promise.resolve(req.chair)
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

/**
 * Update a chair
 */
chairsRouter.put('/:chairId', checkPermissions('chairs:update'), (req, res, next) => {
  return req.chair.merge(req.body).save()
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

/**
 * Delete a chair
 */
chairsRouter.delete('/:chairId', checkPermissions('chairs:delete'), (req, res, next) => {
  // We actually delete chairs as we don't care about history
  return req.chair.delete()
    .then(() => res.status(204).send())
    .catch(next);
});

module.exports = chairsRouter;
