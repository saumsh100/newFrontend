
const chairsRouter = require('express').Router();
const Chair = require('../../../models/Chair');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');

chairsRouter.param('chairId', loaders('chair', 'Chair'));

/**
 * Create a chair
 */
chairsRouter.post('/', (req, res, next) => {
  // Attach chair to the clinic of posting user
  const chairData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });

  return Chair.save(chairData)
    .then(chair => res.send(201, normalize('chair', chair)))
    .catch(next);
});

/**
 * Get all chairs under a clinic
 */
chairsRouter.get('/', (req, res, next) => {
  const { accountId } = req;

  // There is no joinData for chair, no need to put...
  return Chair.filter({ accountId }).run()
    .then(chairs => res.send(normalize('chairs', chairs)))
    .catch(next);
});

/**
 * Get a chair
 */
chairsRouter.get('/:chairId', (req, res, next) => {
  return Promise.resolve(req.chair)
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

/**
 * Update a chair
 */
chairsRouter.put('/:chairId', (req, res, next) => {
  return req.chair.merge(req.body).save()
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

/**
 * Delete a chair
 */
chairsRouter.delete('/:chairId', (req, res, next) => {
  // We actually delete chairs as we don't care about history
  return req.chair.delete()
    .then(() => res.send(204))
    .catch(next);
});

module.exports = chairsRouter;
