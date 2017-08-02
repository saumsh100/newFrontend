const syncClientErrorRouter = require('express').Router();
const SyncClientError = require('../../../models/SyncClientError');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const { namespaces } = require('../../../config/globals');

syncClientErrorRouter.param('syncClientErrorId', loaders('syncClientError', 'SyncClientError'));

/**
 * Get all errors for a particular account
 */
syncClientErrorRouter.get('/', checkPermissions('syncClientError:read'), (req, res, next) => {
  const accountId = req.query.accountId;

  return SyncClientError
    .filter({ accountId }).run()
    .then(syncErrors => res.send(normalize('syncClientErrors', syncErrors)))
    .catch(next);
});

/**
 * Create error
 */
syncClientErrorRouter.post('/', checkPermissions('syncClientError:create'), (req, res, next) => {
  const syncErrorData = Object.assign({}, req.body, { accountId: req.accountId });
  return SyncClientError.save(syncErrorData)
    .then((logEntry) => {
      res.sendStatus(201);
      const io = req.app.get('socketio');
      const ns = namespaces.dash;
      delete logEntry.stackTrace;
      return io.of(ns).in(req.accountId).emit(normalize('syncClientError', logEntry));
    })
    .catch(next);
});

module.exports = syncClientErrorRouter;
