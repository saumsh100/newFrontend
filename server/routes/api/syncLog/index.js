const syncLogRouter = require('express').Router();
const SyncLog = require('../../../models/SyncLog');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');

syncLogRouter.param('syncLogId', loaders('syncLog', 'SyncLog'));

/**
 * Get all errors for a particular account
 */
syncLogRouter.get('/', checkPermissions('syncLog:read'), (req, res, next) => {
  const accountId = req.query.accountId;

  return SyncLog
    .filter({ accountId }).run()
    .then(syncErrors => res.send(normalize('syncLog', syncErrors)))
    .catch(next);
});

/**
 * Create error
 */
syncLogRouter.post('/', checkPermissions('syncLog:create'), (req, res, next) => {
  const syncErrorData = Object.assign({}, req.body, { accountId: req.accountId });

  return SyncLog.save(syncErrorData)
    .then(() => res.sendStatus(201))
    .catch(next);
});

module.exports = syncLogRouter;
