import { Router } from 'express';
import { namespaces } from '../../../config/globals';
import { SyncClientError } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';

const syncClientErrorRouter = new Router();

syncClientErrorRouter.param('syncClientErrorId', sequelizeLoader('syncClientError', 'SyncClientError'));

/**
 * Get all errors for a particular account
 */
syncClientErrorRouter.get('/', checkPermissions('syncClientError:read'), async (req, res, next) => {
  const accountId = req.query.accountId;
  try {
    const syncClientErrors = await SyncClientError.findAll({
      raw: true,
      where: { accountId },
    });

    res.send(normalize('syncClientErrors', syncClientErrors));
  } catch (error) {
    next(error);
  }
});

/**
 * Create error
 */
syncClientErrorRouter.post('/', checkPermissions('syncClientError:create'), (req, res, next) => {
  const syncErrorData = Object.assign({}, req.body, { accountId: req.accountId });

  SyncClientError.create(syncErrorData)
    .then((logEntry) => {
      res.status(201).send(normalize('syncClientError', logEntry.dataValues));
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      delete logEntry.stackTrace;
      return io.of(ns).in(req.accountId).emit(normalize('syncClientError', logEntry.dataValues));
    })
    .catch(next);
});

module.exports = syncClientErrorRouter;
