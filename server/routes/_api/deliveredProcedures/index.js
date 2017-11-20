
import { Router } from 'express';
import isArray from 'lodash/isArray';
import { DeliveredProcedure } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import batchCreate, { batchUpdate } from '../../util/batch';
import format from '../../util/format';

const deliveredProceduresRouter = new Router();

deliveredProceduresRouter.param('deliveredProcedureId', sequelizeLoader('deliveredProcedure', 'DeliveredProcedure'));

/**
 * Create a deliveredProcedure
 */
deliveredProceduresRouter.post('/', checkPermissions('deliveredProcedures:create'), (req, res, next) => {
  const dpData = Object.assign({}, { accountId: req.accountId }, req.body);
  return DeliveredProcedure.create(dpData)
    .then(dp => res.status(201).send(format(req, res, 'deliveredProcedure', dp.get({ plain: true }))))
    .catch(next);
});

/**
 * Batch create a deliveredProcedure
 */
deliveredProceduresRouter.post('/connector/batch', checkPermissions('deliveredProcedures:create'), (req, res, next) => {
  const deliveredProcedures = req.body;
  const cleanedDeliveredProcedures = deliveredProcedures.map(deliveredProcedure => Object.assign(
    {},
    deliveredProcedure,
    { accountId: req.accountId }
  ));

  return batchCreate(cleanedDeliveredProcedures, DeliveredProcedure, 'deliveredProcedure')
    .then(dps => dps.map(dp => dp.get({ plain: true })))
    .then(dps => res.send(format(req, res, 'deliveredProcedures', dps)))
    .catch((err) => {
      let { errors, docs } = err;
      if (!isArray(errors) || !isArray(docs)) {
        throw err;
      }

      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'deliveredProcedures', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Batch update deliveredProcedures for connector
 */
deliveredProceduresRouter.put('/connector/batch', checkPermissions('deliveredProcedures:update'),
(req, res, next) => {
  const deliveredProcedures = req.body;
  return batchUpdate(
    deliveredProcedures,
    DeliveredProcedure,
    'DeliveredProcedure',
  )
    .then((savedDeliveredProcedures) => {
      savedDeliveredProcedures = savedDeliveredProcedures.map(savedDeliveredProcedure => savedDeliveredProcedure.get({ plain: true }));
      res.status(201).send(format(req, res, 'deliveredProcedures', savedDeliveredProcedures));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'deliveredProcedures', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Update a deliveredProcedure entry
 */
deliveredProceduresRouter.put('/:deliveredProcedureId', checkPermissions('deliveredProcedures:update'), (req, res, next) => {
  return req.deliveredProcedure.update(req.body)
    .then(dp => res.send(format(req, res, 'deliveredProcedure', dp.get({ plain: true }))))
    .catch(next);
});

/**
 * Delete a deliveredProcedure entry
 */
deliveredProceduresRouter.delete('/:deliveredProcedureId', checkPermissions('deliveredProcedures:delete'), (req, res, next) => {
  return req.deliveredProcedure.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = deliveredProceduresRouter;
